/* Pure calculators. No DOM, no storage. */
(function(global){
  function round2(n){ return Math.round(n*100)/100; }

  // Tiles: area -> boxes (rounded up) with wastage, + cost.
  function tileCoverage(o){
    var area = round2(o.length * o.width);
    var withWaste = area * (1 + o.waste);
    var boxes = Math.ceil(round2(withWaste) / o.sqmPerBox);
    var pricePerBox = Math.round(o.pricePerSqm * o.sqmPerBox);
    return {
      area: area,
      boxes: boxes,
      tiles: boxes * o.tilesPerBox,
      coveredSqm: round2(boxes * o.sqmPerBox),
      pricePerBox: pricePerBox,
      cost: boxes * pricePerBox
    };
  }

  // Paint: litres needed, then a tin recommendation that minimises cost.
  function paintLitres(o){
    var litres = Math.ceil((o.area * o.coats) / o.coveragePerL);
    var best = bestTins(litres, o.sizes);
    return { litres: litres, tins: best.tins, cost: best.cost };
  }

  // Greedy from largest tin down, then top up with the smallest that covers remainder.
  // 🎓 Your turn: this is a reasonable heuristic; you could make it a true least-cost search.
  function bestTins(litres, sizes){
    var sorted = sizes.slice().sort(function(a,b){return b.litres-a.litres;});
    var remaining = litres, tins = [], cost = 0;
    for (var i=0;i<sorted.length;i++){
      var s = sorted[i];
      if (i === sorted.length-1){ // smallest tin: round up remainder
        var q = Math.ceil(remaining / s.litres);
        if (q>0){ tins.push({litres:s.litres, price:s.price, qty:q}); cost += q*s.price; remaining -= q*s.litres; }
      } else {
        var qty = Math.floor(remaining / s.litres);
        if (qty>0){ tins.push({litres:s.litres, price:s.price, qty:qty}); cost += qty*s.price; remaining -= qty*s.litres; }
      }
    }
    return { tins: tins, cost: cost };
  }

  var api = { tileCoverage: tileCoverage, paintLitres: paintLitres };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.DecorkCalc = api;
})(typeof window !== 'undefined' ? window : globalThis);
