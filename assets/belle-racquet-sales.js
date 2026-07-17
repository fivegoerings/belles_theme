(function(){
  // SID is set by the inline data script via window.BelleRacquetSales
  var SID = Object.keys(window.BelleRacquetSales || {})[0];
  var DATA = window.BelleRacquetSales[SID];
  if (!DATA) return;

  var grid    = document.getElementById("brs-grid-" + SID);
  var filters = document.getElementById("brs-filters-" + SID);
  var overlay = document.getElementById("brs-overlay-" + SID);
  var toast   = document.getElementById("brs-toast-" + SID);

  function money(cents){
    var fmt = DATA.moneyFormat || "${{amount}}";
    var amt = (parseInt(cents,10)/100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
    return fmt.replace(/\{\{\s*amount\s*\}\}/, amt).replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents/100));
  }
  function showToast(msg){
    toast.textContent = msg; toast.classList.add("show");
    setTimeout(function(){ toast.classList.remove("show"); }, 2600);
  }

  // Updates the header cart count. Builds the bubble if the cart started empty
  // (Dawn only renders .cart-count-bubble when the cart is non-empty on page load).
  function updateCartCount(count){
    var bubbleSpan = document.querySelector(".cart-count-bubble span[aria-hidden]");
    if (bubbleSpan){
      bubbleSpan.textContent = count;
      return;
    }
    var cartIcon = document.getElementById("cart-icon-bubble");
    if (!cartIcon) return;
    var bubble = document.createElement("div");
    bubble.className = "cart-count-bubble";
    bubble.innerHTML = '<span aria-hidden="true">' + count + '</span>' +
                       '<span class="visually-hidden">' + count + ' items</span>';
    cartIcon.appendChild(bubble);
  }

  /* Filters */
  if (filters){
    filters.addEventListener("click", function(e){
      var btn = e.target.closest(".brs-filter"); if(!btn) return;
      filters.querySelectorAll(".brs-filter").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      grid.querySelectorAll(".brs-card").forEach(function(card){
        var match = (f === "all") || (card.getAttribute("data-type") === f);
        card.classList.toggle("is-hidden", !match);
      });
    });
  }

  /* Open modal */
  function openModal(id){
    var p = DATA.products[id]; if(!p) return;
    var imgWrap = document.getElementById("brs-img-" + SID);
    var thumbWrap = document.getElementById("brs-thumbs-" + SID);

    // Build the gallery from all product images (fall back to featured, then placeholder)
    var gallery = (p.images && p.images.length) ? p.images.slice() : (p.image ? [p.image] : []);
    function showMain(src){
      imgWrap.innerHTML = '<img src="' + src + '" alt="' + (p.title || "") + '">';
      var mainImg = imgWrap.querySelector("img");
      if (mainImg){
        mainImg.addEventListener("click", function(){ openLightbox(src, p.title || ""); });
      }
      if (thumbWrap){
        thumbWrap.querySelectorAll(".brs-modal__thumb").forEach(function(t){
          t.classList.toggle("active", t.getAttribute("data-src") === src);
        });
      }
    }
    if (gallery.length){
      showMain(gallery[0]);
    } else {
      imgWrap.innerHTML = '<svg width="60" height="60" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="8" rx="6" ry="7" stroke="#1a3c2a" stroke-width="1.2" opacity="0.2"/></svg>';
    }
    if (thumbWrap){
      thumbWrap.innerHTML = "";
      if (gallery.length > 1){
        thumbWrap.classList.remove("is-empty");
        gallery.forEach(function(src, i){
          var b = document.createElement("button");
          b.type = "button";
          b.className = "brs-modal__thumb" + (i === 0 ? " active" : "");
          b.setAttribute("data-src", src);
          b.setAttribute("aria-label", "View image " + (i + 1));
          b.innerHTML = '<img src="' + src + '" alt="">';
          b.addEventListener("click", function(){ showMain(src); });
          thumbWrap.appendChild(b);
        });
      } else {
        thumbWrap.classList.add("is-empty");
      }
    }
    document.getElementById("brs-series-" + SID).textContent = p.series || "";
    document.getElementById("brs-name-" + SID).textContent = p.title || "";
    document.getElementById("brs-price-" + SID).textContent = money(p.price);
    document.getElementById("brs-desc-" + SID).textContent = p.desc || "";

    var specsEl = document.getElementById("brs-specs-" + SID);
    specsEl.innerHTML = "";
    Object.keys(p.specs).forEach(function(k){
      var val = p.specs[k];
      if (val){
        var row = document.createElement("div");
        row.className = "brs-spec";
        row.innerHTML = "<span>"+k+"</span><span>"+val+"</span>";
        specsEl.appendChild(row);
      }
    });

    var sel = document.getElementById("brs-variant-" + SID);
    var wrap = document.getElementById("brs-variant-wrap-" + SID);
    sel.innerHTML = "";
    var realVariants = p.variants.filter(function(v){ return v.title && v.title !== "Default Title"; });
    if (realVariants.length){
      wrap.style.display = "";
      p.variants.forEach(function(v){
        var o = document.createElement("option");
        o.value = v.id; o.textContent = v.title + (v.available ? "" : " (Sold Out)");
        o.disabled = !v.available;
        sel.appendChild(o);
      });
    } else {
      wrap.style.display = "none";
    }

    var addBtn = document.getElementById("brs-add-" + SID);
    addBtn.disabled = !p.available;
    addBtn.textContent = p.available ? "Add to Cart" : "Sold Out";

    // Stock status note: reflects whichever variant is currently selected,
    // falling back to the product-level flag when there's no variant picker.
    // Shows the backorder note, or an "N items available" count for tracked
    // in-stock variants (untracked variants have unlimited stock, so no count).
    var backorderEl = document.getElementById("brs-backorder-" + SID);
    var stockEl = document.getElementById("brs-stock-" + SID);
    function updateStockStatus(){
      var vid = realVariants.length ? sel.value : (p.variants[0] && p.variants[0].id);
      var v = p.variants.filter(function(x){ return String(x.id) === String(vid); })[0];
      var backordered = v ? v.backordered : p.backordered;
      if (backorderEl){
        if (backordered && p.backorderLabel){
          backorderEl.textContent = p.backorderLabel;
          backorderEl.hidden = false;
        } else {
          backorderEl.hidden = true;
        }
      }
      if (stockEl){
        var qty = v ? v.quantity : null;
        if (!backordered && v && v.tracked && qty > 0){
          stockEl.textContent = qty + (qty === 1 ? " item available" : " items available");
          stockEl.hidden = false;
        } else {
          stockEl.hidden = true;
        }
      }
    }
    updateStockStatus();
    sel.onchange = updateStockStatus;

    // Stringing add-on reset
    var strOn = document.getElementById("brs-string-on-" + SID);
    if (strOn && DATA.stringing && DATA.stringing.variantId){
      var strOpts = document.getElementById("brs-string-opts-" + SID);
      var strPrice = document.getElementById("brs-string-price-" + SID);
      if (strPrice) strPrice.textContent = DATA.stringing.priceLabel || "";
      strOn.checked = false;
      if (strOpts) strOpts.hidden = true;
      strOn.onchange = function(){ if (strOpts) strOpts.hidden = !strOn.checked; };
    }

    addBtn.onclick = function(){
      var vid = (realVariants.length ? sel.value : p.variants[0].id);
      addToCart(vid, addBtn);
    };
    document.getElementById("brs-note-" + SID).textContent = DATA.note;

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Fullscreen zoom lightbox
  var lightbox = document.getElementById("brs-lightbox-" + SID);
  var lightboxImg = document.getElementById("brs-lightbox-img-" + SID);
  function openLightbox(src, alt){
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
  }
  function closeLightbox(){
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }
  if (lightbox){
    lightbox.addEventListener("click", function(e){
      // Click anywhere (backdrop, image, or close button) closes
      if (e.target === lightbox || e.target.hasAttribute("data-lb-close") || e.target === lightboxImg) closeLightbox();
    });
  }

  function addToCart(variantId, btn){
    btn.disabled = true; btn.textContent = "Adding...";

    var items = [{ id: parseInt(variantId,10), quantity: 1 }];

    // If stringing toggle is on, add the stringing product with string + tension as notes
    var strOn = document.getElementById("brs-string-on-" + SID);
    if (strOn && strOn.checked && DATA.stringing && DATA.stringing.variantId){
      var strSel  = document.getElementById("brs-string-sel-" + SID);
      var tension = document.getElementById("brs-tension-" + SID);
      var props = {
        "String": strSel ? strSel.value : "Let Belle's recommend",
        "Tension": (tension && tension.value.trim()) ? tension.value.trim() : "Belle's standard"
      };
      // Capture which racquet this stringing is for, so the order is unambiguous
      var nameEl = document.getElementById("brs-name-" + SID);
      if (nameEl && nameEl.textContent) props["For racquet"] = nameEl.textContent;
      items.push({ id: parseInt(DATA.stringing.variantId,10), quantity: 1, properties: props });
    }

    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items, sections: "cart-drawer,cart-icon-bubble" })
    })
    .then(function(r){ if(!r.ok) throw new Error("add failed"); return r.json(); })
    .then(function(response){
      btn.disabled = false; btn.textContent = "Add to Cart";
      closeModal();

      var parser = new DOMParser();

      // Update cart icon bubble
      if (response.sections && response.sections['cart-icon-bubble']) {
        var bubbleDoc = parser.parseFromString(response.sections['cart-icon-bubble'], 'text/html');
        var newBubble = bubbleDoc.querySelector('.cart-count-bubble');
        var cartIconEl = document.getElementById('cart-icon-bubble');
        if (cartIconEl && newBubble) {
          var existingBubble = cartIconEl.querySelector('.cart-count-bubble');
          if (existingBubble) { existingBubble.outerHTML = newBubble.outerHTML; }
          else { cartIconEl.appendChild(newBubble); }
        }
      }

      // Replace the entire cart-drawer element from the section response.
      // This triggers Dawn's connectedCallback to re-initialize event listeners
      // cleanly before we call open(), avoiding broken intermediate states.
      if (response.sections && response.sections['cart-drawer']) {
        var temp = document.createElement('div');
        temp.innerHTML = response.sections['cart-drawer'];
        var newCartDrawer = temp.querySelector('cart-drawer');
        var existingCartDrawer = document.querySelector('cart-drawer');
        if (newCartDrawer && existingCartDrawer) {
          existingCartDrawer.replaceWith(newCartDrawer);
          if (typeof newCartDrawer.open === 'function') {
            newCartDrawer.open();
          }
        }
      }

      // Fetch cart totals for toast
      fetch("/cart.js").then(function(r){return r.json();}).then(function(c){
        updateCartCount(c.item_count);
        showToast("Added to cart \u2022 " + c.item_count + (c.item_count === 1 ? " item" : " items"));
      });
    })
    .catch(function(){
      btn.disabled = false; btn.textContent = "Add to Cart";
      showToast("Could not add to cart. Please try again.");
    });
  }

  if (grid){
    grid.addEventListener("click", function(e){
      var card = e.target.closest(".brs-card"); if(!card || card.classList.contains("is-unavailable")) return;
      openModal(card.getAttribute("data-id"));
    });
    grid.addEventListener("keydown", function(e){
      if ((e.key === "Enter" || e.key === " ")){
        var card = e.target.closest(".brs-card");
        if (card && !card.classList.contains("is-unavailable")){ e.preventDefault(); openModal(card.getAttribute("data-id")); }
      }
    });
  }
  overlay.addEventListener("click", function(e){ if (e.target === overlay || e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape"){
      if (lightbox && lightbox.classList.contains("open")) { closeLightbox(); return; }
      if (overlay.classList.contains("open")) closeModal();
    }
  });
})();
