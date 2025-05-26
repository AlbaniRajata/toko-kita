import PurchaseForm from '../components/PurchaseForm';
import { Typography } from 'antd';

const PurchasePage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <Typography.Title level={3}>Pencatatan Pembelian Stok</Typography.Title>
      <PurchaseForm />
    </div>
  );
};

export default PurchasePage;
