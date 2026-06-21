/* Embedded catalog (no fetch -> works from file://) + render helpers. */
window.DECORK_CATALOG = {
  tiles: [
    { id:'carrara-60x60', type:'tile', name:'Carrara Marble-Effect Porcelain', origin:'Italian', category:'Floor', finish:'Matte', sizeCm:'600x600', colour:'White', pricePerSqm:8500, sqmPerBox:1.44, tilesPerBox:4, stockBoxes:120, img:'' },
    { id:'terrazzo-grey', type:'tile', name:'Terrazzo Speckle Porcelain', origin:'Spanish', category:'Floor', finish:'Matte', sizeCm:'600x600', colour:'Grey', pricePerSqm:7200, sqmPerBox:1.44, tilesPerBox:4, stockBoxes:80, img:'' },
    { id:'metro-white', type:'tile', name:'Metro Gloss Wall Tile', origin:'Nigerian', category:'Wall', finish:'Gloss', sizeCm:'100x300', colour:'White', pricePerSqm:5400, sqmPerBox:1.00, tilesPerBox:33, stockBoxes:200, img:'' },
    { id:'sage-zellige', type:'tile', name:'Sage Zellige Wall Tile', origin:'Spanish', category:'Wall', finish:'Textured', sizeCm:'100x100', colour:'Green', pricePerSqm:9900, sqmPerBox:0.50, tilesPerBox:50, stockBoxes:60, img:'' },
    { id:'travertine-outdoor', type:'tile', name:'Travertine-Effect Outdoor Porcelain', origin:'Italian', category:'Outdoor', finish:'Textured', sizeCm:'600x600', colour:'Beige', pricePerSqm:11500, sqmPerBox:1.08, tilesPerBox:3, stockBoxes:45, img:'' },
    { id:'charcoal-slate', type:'tile', name:'Charcoal Slate Floor Tile', origin:'Nigerian', category:'Floor', finish:'Matte', sizeCm:'300x600', colour:'Charcoal', pricePerSqm:6800, sqmPerBox:1.26, tilesPerBox:7, stockBoxes:90, img:'' }
  ],
  paint: [
    { id:'decorkote-emulsion', type:'paint', name:'Decorkote Premium Emulsion', category:'Interior', coveragePerL:12,
      finishes:['Matte','Eggshell','Satin'],
      colours:[{name:'Brilliant White',hex:'#F7F5EF',code:'DK-100'},{name:'Sage',hex:'#CFD8C5',code:'DK-220'},{name:'Clay',hex:'#7A3B30',code:'DK-410'},{name:'Forest',hex:'#2E9E3A',code:'DK-330'}],
      sizes:[{litres:1,price:3500},{litres:4,price:11000},{litres:20,price:48000}], img:'' },
    { id:'decorkote-weatherguard', type:'paint', name:'Decorkote Weatherguard Exterior', category:'Exterior', coveragePerL:10,
      finishes:['Matte','Satin'],
      colours:[{name:'Chalk White',hex:'#F4F1E9',code:'DW-100'},{name:'Sandstone',hex:'#D9C7A6',code:'DW-205'},{name:'Terracotta',hex:'#CC3527',code:'DW-440'}],
      sizes:[{litres:4,price:14000},{litres:20,price:62000}], img:'' },
    { id:'decorkote-satinwood', type:'paint', name:'Decorkote Satinwood (Wood & Metal)', category:'Interior', coveragePerL:14,
      finishes:['Satin','Gloss'],
      colours:[{name:'Pure White',hex:'#FBFAF6',code:'DS-100'},{name:'Charcoal',hex:'#2B2926',code:'DS-900'}],
      sizes:[{litres:1,price:4200},{litres:2.5,price:9500}], img:'' }
  ]
};

window.Catalog = {
  all:function(){ return window.DECORK_CATALOG; },
  find:function(id){
    var c=window.DECORK_CATALOG; return c.tiles.concat(c.paint).find(function(p){return p.id===id;});
  },
  _colour:{ White:'#ECE9E2', Grey:'#C7C5C0', Charcoal:'#3C3A38', Beige:'#D9C7A6', Green:'#CBD6C0' },
  // visual stand-in for a real product photo: tiled grid for tiles, colour swatch for paint.
  // If a product has a real `img` set, that photo is used instead.
  thumb:function(p){
    if(p.img){ return '<div class="ph" style="background-image:url('+p.img+');background-size:cover;background-position:center"></div>'; }
    if(p.type==='tile'){
      var base=window.Catalog._colour[p.colour]||'#E5E1D8';
      var grout=p.finish==='Gloss'?'rgba(255,255,255,.45)':'rgba(0,0,0,.10)';
      var cell=p.sizeCm==='100x100'?'14px 14px':(p.sizeCm==='100x300'?'18px 30px':'26px 26px');
      return '<div class="ph" style="background:'+base+';background-image:linear-gradient('+grout+' 1px,transparent 1px),linear-gradient(90deg,'+grout+' 1px,transparent 1px);background-size:'+cell+'"></div>';
    }
    var hex=p.colours[0].hex;
    return '<div class="ph" style="background:'+hex+';position:relative">'+
      '<span style="position:absolute;left:10px;bottom:10px;font-size:11px;color:rgba(0,0,0,.55);background:rgba(255,255,255,.8);padding:2px 8px;border-radius:2px">'+p.colours.length+' colours</span></div>';
  },
  // build a product card (used by listing pages)
  card:function(p){
    var priceLine = p.type==='tile'
      ? Cart.formatNaira(p.pricePerSqm)+' / m²'
      : 'from '+Cart.formatNaira(Math.min.apply(null, p.sizes.map(function(s){return s.price;})));
    var tag = p.type==='tile' ? p.origin : p.category;
    return '<a class="card" href="product.html?id='+p.id+'">'+
      window.Catalog.thumb(p)+'<div class="body">'+
        '<span class="tag">'+tag+'</span>'+
        '<h3 style="margin-top:8px">'+p.name+'</h3>'+
        '<div class="price">'+priceLine+'</div>'+
      '</div></a>';
  }
};
