import { Typography } from 'antd';
import SaleForm from '../components/SaleForm';

const SalesPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <Typography.Title level={3}>Pencatatan Penjualan</Typography.Title>
      <SaleForm />
    </div>
  );
};

export default SalesPage;
