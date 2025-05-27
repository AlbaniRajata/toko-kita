import { applyFIFO } from '../utils/fifoLogic.js';

describe('FIFO Logic', () => {
  const stockList = [
    { id: '1', date: '2024-01-01', quantity: 5, purchasePrice: 1000 },
    { id: '2', date: '2024-02-01', quantity: 10, purchasePrice: 1200 }
  ];

  it('should apply FIFO correctly', () => {
    const result = applyFIFO(stockList, 12);
    expect(result).toEqual([
      { id: '1', date: '2024-01-01', quantity: 5, purchasePrice: 1000, used: 5 },
      { id: '2', date: '2024-02-01', quantity: 10, purchasePrice: 1200, used: 7 }
    ]);
  });

  it('should throw error if not enough stock', () => {
    expect(() => applyFIFO(stockList, 20)).toThrow('Stok tidak cukup');
  });
});
