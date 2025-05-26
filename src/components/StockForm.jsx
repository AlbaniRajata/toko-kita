import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message } from 'antd';
import { addStock } from '../services/api';

const StockForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const data = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      await addStock(data);
      message.success('Stok berhasil ditambahkan!');
      form.resetFields();
    } catch (error) {
      message.error('Gagal menambahkan stok.');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
      <Form.Item name="name" label="Nama Barang" rules={[{ required: true }]}>
        <Input placeholder="Contoh: Pensil 2B" />
      </Form.Item>

      <Form.Item name="quantity" label="Jumlah" rules={[{ required: true, type: 'number', min: 1 }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="purchasePrice" label="Harga Beli per Unit" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="date" label="Tanggal Masuk" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Tambah Stok
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StockForm;
