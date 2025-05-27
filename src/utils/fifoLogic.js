export const applyFIFO = (stockList, qtyToReduce) => {
  const sorted = [...stockList].sort((a, b) => new Date(a.date) - new Date(b.date));
  let remaining = qtyToReduce;
  const result = [];

  for (let stock of sorted) {
    if (remaining <= 0) break;
    const useQty = Math.min(stock.quantity, remaining);
    result.push({ ...stock, used: useQty });
    remaining -= useQty;
  }

  if (remaining > 0) throw new Error('Stok tidak cukup');
  return result;
};
