import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message, Card } from 'antd';
import { addStock } from '../services/api';
import '../styles/StockForm.css';

const StockForm = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const stockData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      
      await addStock(stockData);
      message.success('Batch stok baru berhasil ditambahkan!');
      form.resetFields();
    } catch (error) {
      console.error('Error adding stock:', error);
      message.error('Gagal menambahkan batch stok baru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="stock-form-card">
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
        className="stock-form"
      >
        <Form.Item 
          name="name" 
          label="Nama Barang" 
          rules={[
            { required: true, message: 'Nama barang wajib diisi' },
            { min: 2, message: 'Nama barang minimal 2 karakter' }
          ]}
        >
          <Input 
            placeholder="Contoh: Pensil 2B Faber Castell" 
            className="form-input"
          />
        </Form.Item>

        <Form.Item 
          name="quantity" 
          label="Jumlah Stok" 
          rules={[
            { required: true, message: 'Jumlah stok wajib diisi' },
            { type: 'number', min: 1, message: 'Jumlah minimal 1' }
          ]}
        >
          <InputNumber 
            min={1} 
            className="form-input-number" 
            placeholder="Masukkan jumlah stok"
          />
        </Form.Item>

        <Form.Item 
          name="purchasePrice" 
          label="Harga Beli per Unit (Rp)" 
          rules={[
            { required: true, message: 'Harga beli wajib diisi' },
            { type: 'number', min: 0, message: 'Harga tidak boleh negatif' }
          ]}
        >
          <InputNumber 
            min={0} 
            className="form-input-number" 
            placeholder="Masukkan harga beli per unit"
            formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={value => value.replace(/Rp\s?|(\.*)/g, '')}
          />
        </Form.Item>

        <Form.Item 
          name="date" 
          label="Tanggal Masuk Stok" 
          rules={[{ required: true, message: 'Tanggal masuk stok wajib diisi' }]}
        >
          <DatePicker 
            format="DD/MM/YYYY"
            className="form-date-picker"
            placeholder="Pilih tanggal masuk stok"
          />
        </Form.Item>

        <Form.Item className="form-submit-item">
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
            loading={submitting}
            className="submit-button"
          >
            Tambah Batch Stok Baru
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StockForm;