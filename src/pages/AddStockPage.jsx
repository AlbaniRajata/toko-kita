import React from 'react';
import StockForm from '../components/StockForm';
import { Typography } from 'antd';

const AddStockPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <Typography.Title level={3}>Tambah Stok Baru</Typography.Title>
      <StockForm />
    </div>
  );
};

export default AddStockPage;
