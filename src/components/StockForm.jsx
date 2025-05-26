import { Form, Input, InputNumber, DatePicker, Button, message } from 'antd';
import { addStock } from '../services/api';

const StockForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const stockData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        id: Date.now().toString().slice(-4),
      };
      
      await addStock(stockData);
      message.success('Batch stok baru berhasil ditambahkan!');
      form.resetFields();
    } catch (error) {
      console.error('Error adding stock:', error);
      message.error('Gagal menambahkan batch stok baru.');
    }
  };

  return (
    <div>
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
          <Input placeholder="Contoh: Pensil 2B Faber Castell" />
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
            style={{ width: '100%' }} 
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
            style={{ width: '100%' }} 
            placeholder="Masukkan harga beli per unit"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item 
          name="date" 
          label="Tanggal Masuk Stok" 
          rules={[
            { required: true, message: 'Tanggal masuk stok wajib diisi' }
          ]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD"
            placeholder="Pilih tanggal masuk stok"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Tambah Batch Stok Baru
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StockForm;