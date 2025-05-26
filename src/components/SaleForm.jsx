import { Form, InputNumber, DatePicker, Button, message, Select } from 'antd';
import { addSale, getSortedStocks, updateStock } from '../services/api';
import axios from 'axios';
import { useEffect, useState } from 'react';

const { Option } = Select;

const SaleForm = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:3001/stocks');
        const uniqueNames = [...new Set(res.data.map(item => item.name))];
        setItems(uniqueNames);
      } catch (err) {
        message.error('Gagal mengambil daftar barang.');
      }
    };

    fetchItems();
  }, []);

    const onFinish = async (values) => {
    const { name, quantity, sellingPrice, date } = values;
    const formattedDate = date.format('YYYY-MM-DD');

    try {
      const { data: stocks } = await getSortedStocks(name);
      let remaining = quantity;
      let hpp = 0;
      const updates = [];

      for (let stock of stocks) {
        if (remaining <= 0) break;
        const useQty = Math.min(stock.quantity, remaining);
        hpp += useQty * stock.purchasePrice;
        remaining -= useQty;

        updates.push({
          id: stock.id,
          newQty: stock.quantity - useQty
        });
      }

      if (remaining > 0) {
        message.error('Stok tidak mencukupi untuk penjualan ini!');
        return;
      }

      await Promise.all(
        updates.map(({ id, newQty }) =>
          updateStock(id, { quantity: newQty })
        )
      );

      const sale = {
        id: Date.now().toString().slice(-4),
        name,
        quantity,
        sellingPrice,
        date: formattedDate,
        hpp,
        total: quantity * sellingPrice
      };

      await addSale(sale);
      message.success('Penjualan berhasil dicatat!');
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Terjadi kesalahan saat mencatat penjualan.');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
      <Form.Item name="name" label="Nama Barang" rules={[{ required: true }]}>
        <Select placeholder="Pilih barang">
          {items.map(name => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="quantity" label="Jumlah Terjual" rules={[{ required: true, type: 'number', min: 1 }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="sellingPrice" label="Harga Jual per Unit" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="date" label="Tanggal Penjualan" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Catat Penjualan
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SaleForm;
