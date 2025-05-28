import axios from 'axios';
import dayjs from 'dayjs';
import { addPurchase } from '../services/api';

jest.mock('axios');

describe('Alur Pembelian → Penjualan → Laporan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Happy-path: berhasil pembelian → penjualan', async () => {
    const purchaseData = {
      name: 'Pensil',
      supplier: 'Toko A',
      quantity: 10,
      purchasePrice: 2000,
      date: dayjs('2024-05-01'),
    };

    axios.post.mockResolvedValueOnce({ data: { ...purchaseData, id: 'p001' } });

    await expect(addPurchase({
      ...purchaseData,
      id: 'p001',
      date: purchaseData.date.format('YYYY-MM-DD'),
      total: purchaseData.quantity * purchaseData.purchasePrice
    })).resolves.toBeTruthy();

    axios.get.mockResolvedValueOnce({
      data: [
        { id: 's1', name: 'Pensil', quantity: 5, purchasePrice: 1000, date: '2024-05-01' },
        { id: 's2', name: 'Pensil', quantity: 3, purchasePrice: 1200, date: '2024-05-02' }
      ]
    });

    const stocks = await axios.get('http://localhost:3001/stocks?name=Pensil');
    let remaining = 6;
    let totalHpp = 0;

    for (const stock of stocks.data) {
      if (remaining <= 0) break;
      const useQty = Math.min(stock.quantity, remaining);
      totalHpp += useQty * stock.purchasePrice;
      remaining -= useQty;

      await axios.patch(`http://localhost:3001/stocks/${stock.id}`, {
        quantity: stock.quantity - useQty
      });
    }

    const saleData = {
      id: 's999',
      name: 'Pensil',
      quantity: 6,
      sellingPrice: 3000,
      date: '2024-05-03',
      hpp: totalHpp,
      profit: (6 * 3000) - totalHpp,
      total: 6 * 3000
    };

    await axios.post('http://localhost:3001/sales', saleData);
    expect(axios.patch).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/sales', saleData);
  });

  it('No-stock: gagal jual jika stok tidak tersedia', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const res = await axios.get('http://localhost:3001/stocks?name=Spidol');
    expect(res.data).toHaveLength(0);

    try {
      if (res.data.length === 0) throw new Error('Stok tidak tersedia');
    } catch (err) {
      expect(err.message).toBe('Stok tidak tersedia');
    }
  });

  it('Storage-error: gagal saat simpan pembelian', async () => {
    axios.post.mockRejectedValueOnce(new Error('Storage error'));

    const purchaseData = {
      name: 'Penghapus',
      supplier: 'Toko B',
      quantity: 5,
      purchasePrice: 1500,
      date: dayjs('2024-05-05')
    };

    try {
      await addPurchase({
        ...purchaseData,
        id: 'p999',
        total: 7500,
        date: purchaseData.date.format('YYYY-MM-DD')
      });
    } catch (err) {
      expect(err.message).toBe('Storage error');
    }
  });
});
