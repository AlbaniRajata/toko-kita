import React, { useEffect, useState } from 'react';
import { Form, InputNumber, DatePicker, Button, message, Select, Typography, Card } from 'antd';
import axios from 'axios';
import '../styles/SaleForm.css';

const { Option } = Select;
const { Text } = Typography;

const SaleForm = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [availableStock, setAvailableStock] = useState(0);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3001/stocks');
      const stockSummary = res.data.reduce((acc, item) => {
        if (!acc[item.name]) acc[item.name] = 0;
        acc[item.name] += item.quantity;
        return acc;
      }, {});

      const availableItems = Object.entries(stockSummary)
        .filter(([_, qty]) => qty > 0)
        .map(([name, qty]) => ({ name, quantity: qty }));

      setItems(availableItems);
    } catch (err) {
      console.error('Error fetching items:', err);
      message.error('Gagal mengambil daftar barang.');
    }
  };

  const handleItemChange = (itemName) => {
    setSelectedItem(itemName);
    const item = items.find(item => item.name === itemName);
    setAvailableStock(item ? item.quantity : 0);
    form.setFieldsValue({ quantity: undefined });
  };

  const getSortedStocks = async (itemName) => {
    const res = await axios.get(`http://localhost:3001/stocks?name=${itemName}`);
    return res.data.filter(stock => stock.quantity > 0).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const updateStock = async (id, updatedData) => {
    await axios.patch(`http://localhost:3001/stocks/${id}`, updatedData);
  };

  const addSale = async (saleData) => {
    await axios.post('http://localhost:3001/sales', saleData);
  };

  const onFinish = async (values) => {
    const { name, quantity, sellingPrice, date } = values;
    const formattedDate = date.format('YYYY-MM-DD');

    if (quantity > availableStock) {
      message.error(`Stok tidak mencukupi! Stok tersedia: ${availableStock}`);
      return;
    }

    try {
      const stocks = await getSortedStocks(name);
      let remaining = quantity;
      let totalHpp = 0;
      const updates = [];

      for (let stock of stocks) {
        if (remaining <= 0) break;
        const useQty = Math.min(stock.quantity, remaining);
        totalHpp += useQty * stock.purchasePrice;
        remaining -= useQty;

        updates.push({ id: stock.id, newQty: stock.quantity - useQty });
      }

      await Promise.all(updates.map(({ id, newQty }) => updateStock(id, { quantity: newQty })));

      const saleData = {
        id: Date.now().toString().slice(-4),
        name,
        quantity,
        sellingPrice,
        date: formattedDate,
        hpp: totalHpp,
        profit: (quantity * sellingPrice) - totalHpp,
        total: quantity * sellingPrice
      };

      await addSale(saleData);
      message.success('Penjualan berhasil dicatat!');
      form.resetFields();
      setSelectedItem('');
      setAvailableStock(0);
      fetchItems();
    } catch (error) {
      console.error('Error recording sale:', error);
      message.error('Terjadi kesalahan saat mencatat penjualan.');
    }
  };

  return (
    <Card className="purchase-form-card">
      <Form form={form} layout="vertical" onFinish={onFinish} className="purchase-form">
        <Form.Item
          name="name"
          label="Nama Barang"
          rules={[{ required: true, message: 'Pilih barang yang dijual' }]}
        >
          <Select
            placeholder="Pilih barang"
            onChange={handleItemChange}
            onFocus={() => form.setFieldsValue({ _selectFocused: true })}
            onBlur={() => form.setFieldsValue({ _selectFocused: false })}
            className={`form-select ${form.getFieldValue('_selectFocused') ? 'form-select-focused' : ''}`}
            showSearch
            filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
            }
            >
            {items.map(item => (
                <Option key={item.name} value={item.name}>
                {item.name} (Stok: {item.quantity})
                </Option>
            ))}
            </Select>
        </Form.Item>

        {selectedItem && (
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            Stok tersedia: {availableStock} unit
          </Text>
        )}

        <div className="form-row">
          <Form.Item
            name="quantity"
            label="Jumlah Terjual"
            rules={[
              { required: true, message: 'Jumlah terjual wajib diisi' },
              { type: 'number', min: 1, message: 'Jumlah minimal 1' },
              {
                validator: (_, value) => {
                  if (value && value > availableStock) {
                    return Promise.reject(new Error(`Maksimal ${availableStock} unit`));
                  }
                  return Promise.resolve();
                }
              }
            ]}
            className="form-item-half"
          >
            <InputNumber
              min={1}
              max={availableStock}
              placeholder="Jumlah"
              className="form-input-number"
              disabled={!selectedItem}
            />
          </Form.Item>

          <Form.Item
            name="sellingPrice"
            label="Harga Jual per Unit (Rp)"
            rules={[
              { required: true, message: 'Harga jual wajib diisi' },
              { type: 'number', min: 0, message: 'Harga tidak boleh negatif' }
            ]}
            className="form-item-half"
          >
            <InputNumber
              min={0}
              placeholder="Harga per unit"
              formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={value => value.replace(/Rp\s?|(\.*)/g, '')}
              className="form-input-number"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="date"
          label="Tanggal Penjualan"
          rules={[{ required: true, message: 'Tanggal penjualan wajib diisi' }]}
        >
          <DatePicker
            className="form-date-picker"
            format="DD/MM/YYYY"
            placeholder="Pilih tanggal penjualan"
          />
        </Form.Item>

        <Form.Item className="form-submit-item">
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="submit-button"
          >
            Catat Penjualan
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SaleForm;
