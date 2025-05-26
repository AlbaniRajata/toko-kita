import { Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PurchasesList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/purchases').then((res) => {
      setData(res.data);
    });
  }, []);

  const columns = [
    { title: 'Tanggal', dataIndex: 'date', key: 'date' },
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
    { title: 'Jumlah', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Harga Beli / pcs', dataIndex: 'purchasePrice', key: 'purchasePrice', render: (val) => `Rp${val}` },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Typography.Title level={3}>Riwayat Pembelian</Typography.Title>
      <Table rowKey="id" dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default PurchasesList;
