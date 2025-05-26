import { Form, Input, InputNumber, DatePicker, Button, message } from 'antd';
import { addPurchase } from '../services/api';

const PurchaseForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formatted = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      id: Date.now().toString().slice(-4),
    };

    try {
      await addPurchase(formatted);

      message.success('Pembelian berhasil dicatat!');
      form.resetFields();
    } catch (err) {
      message.error('Gagal mencatat pembelian.');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
      <Form.Item name="name" label="Nama Barang" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="supplier" label="Supplier" rules={[{ required: true, message: 'Supplier wajib diisi' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="quantity" label="Jumlah" rules={[{ required: true, type: 'number', min: 1 }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="purchasePrice" label="Harga Beli per Unit" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="date" label="Tanggal Pembelian" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Catat Pembelian
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PurchaseForm;
