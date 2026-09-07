/*
  GA4 custom pixel for Belle's Performance Tennis Shop
  ----------------------------------------------------
  WHERE THIS GOES: this is NOT theme code. Do not put it in the theme.

    Shopify Admin -> Settings -> Customer events -> Add custom pixel
    Name it "Calendly booking events", paste this in, Save, then Connect.

  WHY IT IS NEEDED: snippets/calendly-modal.liquid publishes two events with
  Shopify.analytics.publish(). Publishing alone does not reach GA4. A pixel
  has to subscribe to them and forward them on. Until this pixel exists, the
  theme is emitting into the void.

  WHY IT LOADS ITS OWN gtag: Shopify custom pixels run in a sandboxed frame
  with no access to the page's own analytics, and this store loads GA4
  through the Google channel rather than a theme snippet, so window.gtag
  does not exist in page context either. The pixel therefore loads its own
  copy inside its own sandbox.

  send_page_view is false ON PURPOSE. The Google channel already reports
  pageviews for G-SKJK8YPREK. Leaving it on would double count every one.
  This pixel should only ever send the two Calendly events.

  Events forwarded:
    calendly_modal_open       someone opened the booking modal (intent)
    calendly_event_scheduled  Calendly confirmed a booking  (THE CONVERSION)

  Both carry:
    booking_source  from utm_content on the CTA that was clicked, so you can
                    tell the homepage hero from a city page from the blog
    page_path       the page the visitor was on

  AFTER CONNECTING, in GA4: Admin -> Events -> mark calendly_event_scheduled
  as a key event, otherwise it will not appear in conversion reporting.
*/

const MEASUREMENT_ID = 'G-SKJK8YPREK';

// Load gtag inside this pixel's sandbox
const s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
document.head.appendChild(s);

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', MEASUREMENT_ID, { send_page_view: false });

function forward(name) {
  analytics.subscribe(name, (event) => {
    const d = (event && event.customData) || {};
    gtag('event', name, {
      booking_source: d.booking_source || 'unknown',
      page_path: d.page_path || ''
    });
  });
}

forward('calendly_modal_open');
forward('calendly_event_scheduled');
