import React, { useState } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message, Card } from 'antd';
import { addPurchase } from '../services/api';
import '../styles/PurchaseForm.css';

const PurchaseForm = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    const purchaseData = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      id: Date.now().toString().slice(-4),
      total: values.quantity * values.purchasePrice
    };

    try {
      await addPurchase(purchaseData);
      message.success('Pembelian berhasil dicatat!');
      form.resetFields();
    } catch (error) {
      console.error('Error recording purchase:', error);
      message.error('Gagal mencatat pembelian.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="purchase-form-card">
      
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        className="purchase-form"
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
            placeholder="Masukkan nama barang yang dibeli" 
            className="form-input"
          />
        </Form.Item>

        <Form.Item 
          name="supplier" 
          label="Supplier" 
          rules={[
            { required: true, message: 'Supplier wajib diisi' },
            { min: 2, message: 'Nama supplier minimal 2 karakter' }
          ]}
        >
          <Input 
            placeholder="Masukkan nama supplier" 
            className="form-input"
          />
        </Form.Item>

        <div className="form-row">
          <Form.Item 
            name="quantity" 
            label="Jumlah Dibeli" 
            rules={[
              { required: true, message: 'Jumlah wajib diisi' },
              { type: 'number', min: 1, message: 'Jumlah minimal 1' }
            ]}
            className="form-item-half"
          >
            <InputNumber 
              min={1} 
              placeholder="Jumlah"
              className="form-input-number"
            />
          </Form.Item>

          <Form.Item 
            name="purchasePrice" 
            label="Harga Beli per Unit (Rp)" 
            rules={[
              { required: true, message: 'Harga beli wajib diisi' },
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
          label="Tanggal Pembelian" 
          rules={[
            { required: true, message: 'Tanggal pembelian wajib diisi' }
          ]}
        >
          <DatePicker 
            format="DD/MM/YYYY"
            placeholder="Pilih tanggal pembelian"
            className="form-date-picker"
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
            Catat Pembelian
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PurchaseForm;