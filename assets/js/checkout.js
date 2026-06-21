/* Simulated checkout. No real payment. */
window.Checkout = {
  orderNumber:function(){ return 'DK-'+Date.now().toString().slice(-6); },
  placeOrder:function(details){
    var items=Cart.read();
    var sub=Cart.subtotal(items), del=Cart.deliveryFee(sub);
    var order={ number:this.orderNumber(), items:items, subtotal:sub, delivery:del, total:sub+del, details:details, when:new Date().toISOString() };
    sessionStorage.setItem('decork_last_order', JSON.stringify(order));
    Cart.clear();
    return order;
  }
};
