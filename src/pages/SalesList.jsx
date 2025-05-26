import { Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SalesList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/sales').then((res) => {
      setData(res.data);
    });
  }, []);

  const columns = [
    { title: 'Tanggal', dataIndex: 'date', key: 'date' },
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    { title: 'Jumlah', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Harga Jual / pcs', dataIndex: 'sellingPrice', key: 'sellingPrice', render: (val) => `Rp${val}` },
    { title: 'HPP', dataIndex: 'hpp', key: 'hpp', render: (val) => `Rp${val}` },
    { title: 'Total Penjualan', dataIndex: 'total', key: 'total', render: (val) => `Rp${val}` },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Typography.Title level={3}>Riwayat Penjualan</Typography.Title>
      <Table rowKey="id" dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default SalesList;
