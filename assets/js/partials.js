/* Injects shared chrome into every page. Looks for <div id="header"></div> and <div id="footer"></div>. */

/* Decork logo. The header uses the real file at assets/img/logo.png if present;
   if that file is missing, it falls back to this crisp vector recreation. */
window.DecorkLogo = {
  svg: `<svg class="logo-svg" height="46" viewBox="0 0 252 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decork">
    <g fill="#CC3527">
      <rect x="3" y="10" width="6" height="6"/>
      <rect x="12" y="4" width="8" height="8"/>
      <rect x="3" y="19" width="5" height="5"/>
      <rect x="13" y="16" width="9" height="9"/>
    </g>
    <path d="M28,10 L28,52 M28,10 L38,10 A21,21 0 0 1 38,52 L28,52" fill="none" stroke="#CC3527" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="76" y="48" font-family="'Hanken Grotesk',sans-serif" font-weight="800" font-size="38" letter-spacing="0.5" fill="#2E9E3A">DEC</text>
    <g>
      <path d="M158,23 C170,31 170,44 158,52 C146,44 146,31 158,23 Z" fill="#2E9E3A"/>
      <path d="M158,23 C170,31 170,44 158,52 C158,44 158,31 158,23 Z" fill="#CC3527"/>
      <path d="M158,25 L158,50" stroke="#1f7a28" stroke-width="1.6"/>
    </g>
    <text x="176" y="48" font-family="'Hanken Grotesk',sans-serif" font-weight="800" font-size="38" letter-spacing="0.5" fill="#2E9E3A">RK</text>
  </svg>`,
  fallback: function(img){ img.outerHTML = window.DecorkLogo.svg; }
};

(function(){
  var nav = [
    ['Tiles','tiles.html'],['Paint','paint.html'],
    ['Our Locations','locations.html'],['About','about.html']
  ];
  function headerHTML(){
    var links = nav.map(function(n){return '<a href="'+n[1]+'">'+n[0]+'</a>';}).join('');
    return ''+
    '<div class="band announce">Nigerian · Italian · Spanish Tiles &nbsp;·&nbsp; Decorkote Paints &nbsp;|&nbsp; Free Samples · Nationwide Delivery</div>'+
    '<header class="site-header"><div class="wrap inner">'+
      '<a class="logo" href="index.html"><img src="assets/img/logo.png" alt="Decork" style="height:46px;display:block" onerror="DecorkLogo.fallback(this)"></a>'+
      '<nav class="mainnav">'+links+
        '<a class="cartlink" href="cart.html">Cart<span class="cartbadge" id="cart-count">0</span></a>'+
      '</nav>'+
    '</div></header>';
  }
  function footerHTML(){
    return ''+
    '<footer class="site-footer"><div class="wrap cols">'+
      '<div><h4>Contact</h4>'+
        '<a href="locations.html">Aba · 119 Faulks Rd, Abia</a>'+
        '<a href="locations.html">Enugu · Bldg Materials Mkt</a>'+
        '<a href="locations.html">Abuja · Dei Dei Intl Mkt</a>'+
        '<a href="tel:07067685620">0706 768 5620</a></div>'+
      '<div><h4>Company</h4><a href="about.html">About Us</a><a href="about.html">The Decork Group</a><a href="about.html">Decork Logistics</a></div>'+
      '<div><h4>Your Order</h4><a href="#">Delivery & Returns</a><a href="#">FAQ</a><a href="cart.html">Your Cart</a></div>'+
      '<div><h4>Products</h4><a href="tiles.html">Tiles</a><a href="paint.html">Paint</a><a href="#">Free Samples</a></div>'+
    '</div><div class="copyright">© '+new Date().getFullYear()+' Decork Group · Aba · Enugu · Abuja</div></footer>';
  }
  function inject(id,html){var el=document.getElementById(id); if(el) el.outerHTML=html;}
  document.addEventListener('DOMContentLoaded',function(){
    inject('header',headerHTML());
    inject('footer',footerHTML());
    if(window.Cart && document.getElementById('cart-count')){
      document.getElementById('cart-count').textContent = Cart.count();
    }
  });
})();
