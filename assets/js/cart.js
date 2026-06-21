/* Cart: pure math (tested) + localStorage layer (browser only). */
(function(global){
  var FREE_DELIVERY_OVER = 100000;   // 🎓 Your turn: set Decork's real threshold
  var FLAT_DELIVERY = 5000;          // placeholder flat fee under threshold

  function formatNaira(n){ return '₦' + Math.round(n).toLocaleString('en-NG'); }
  function lineTotal(item){ return item.unitPrice * item.qty; }
  function subtotal(items){ return items.reduce(function(s,i){return s + lineTotal(i);},0); }
  function deliveryFee(sub){ return sub >= FREE_DELIVERY_OVER ? 0 : FLAT_DELIVERY; }
  function grandTotal(items){ var s = subtotal(items); return s + deliveryFee(s); }

  var math = { formatNaira:formatNaira, lineTotal:lineTotal, subtotal:subtotal,
               deliveryFee:deliveryFee, grandTotal:grandTotal,
               FREE_DELIVERY_OVER:FREE_DELIVERY_OVER, FLAT_DELIVERY:FLAT_DELIVERY };

  if (typeof module !== 'undefined' && module.exports){ module.exports = math; return; }

  // ---- browser storage layer ----
  var KEY = 'decork_cart';
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; } }
  function write(items){ localStorage.setItem(KEY, JSON.stringify(items)); }
  /* item: { id, name, kind:'tile'|'paint', variant, unitLabel, unitPrice, qty, meta } */
  function add(item){
    var items = read();
    var key = item.id + '|' + (item.variant||'');
    var found = items.find(function(i){ return (i.id+'|'+(i.variant||'')) === key; });
    if (found) found.qty += item.qty; else items.push(item);
    write(items); return items;
  }
  function setQty(key, qty){ var items=read().map(function(i){ if((i.id+'|'+(i.variant||''))===key) i.qty=Math.max(1,qty); return i; }); write(items); return items; }
  function remove(key){ var items=read().filter(function(i){ return (i.id+'|'+(i.variant||''))!==key; }); write(items); return items; }
  function clear(){ write([]); }
  function count(){ return read().reduce(function(s,i){return s+i.qty;},0); }

  global.Cart = Object.assign({}, math, { read:read, add:add, setQty:setQty, remove:remove, clear:clear, count:count });
})(typeof window !== 'undefined' ? window : globalThis);
