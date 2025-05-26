import { Form, Input, InputNumber, DatePicker, Button, message } from 'antd';
import { addPurchase } from '../services/api';

const PurchaseForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
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
    }
  };

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish} 
      style={{ maxWidth: 400 }}
    >
      <Form.Item 
        name="name" 
        label="Nama Barang" 
        rules={[
          { required: true, message: 'Nama barang wajib diisi' },
          { min: 2, message: 'Nama barang minimal 2 karakter' }
        ]}
      >
        <Input placeholder="Masukkan nama barang yang dibeli" />
      </Form.Item>

      <Form.Item 
        name="supplier" 
        label="Supplier" 
        rules={[
          { required: true, message: 'Supplier wajib diisi' },
          { min: 2, message: 'Nama supplier minimal 2 karakter' }
        ]}
      >
        <Input placeholder="Masukkan nama supplier" />
      </Form.Item>

      <Form.Item 
        name="quantity" 
        label="Jumlah Dibeli" 
        rules={[
          { required: true, message: 'Jumlah wajib diisi' },
          { type: 'number', min: 1, message: 'Jumlah minimal 1' }
        ]}
      >
        <InputNumber 
          min={1} 
          style={{ width: '100%' }} 
          placeholder="Masukkan jumlah yang dibeli"
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
          style={{ width: '100%' }} 
          placeholder="Masukkan harga beli per unit"
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item 
        name="date" 
        label="Tanggal Pembelian" 
        rules={[
          { required: true, message: 'Tanggal pembelian wajib diisi' }
        ]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          format="YYYY-MM-DD"
          placeholder="Pilih tanggal pembelian"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          Catat Pembelian
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PurchaseForm;