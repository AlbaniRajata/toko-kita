import { Table, Typography, Card } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SalesList.css';

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
    { 
      title: 'Harga Jual / pcs', 
      dataIndex: 'sellingPrice', 
      key: 'sellingPrice', 
      render: (val) => `Rp${val.toLocaleString('id-ID')}` 
    },
    { 
      title: 'HPP', 
      dataIndex: 'hpp', 
      key: 'hpp', 
      render: (val) => `Rp${val.toLocaleString('id-ID')}` 
    },
    { 
      title: 'Total Penjualan', 
      dataIndex: 'total', 
      key: 'total', 
      render: (val) => `Rp${val.toLocaleString('id-ID')}` 
    },
  ];

  return (
    <>
      <div style={{ padding: '2rem' }}>
        <Typography.Title level={3}>Riwayat Penjualan</Typography.Title>
        <Card className="sales-list-card">
          <Table 
            rowKey="id" 
            dataSource={data} 
            columns={columns} 
            pagination={{ pageSize: 5 }} 
          />
        </Card>
      </div>
    </>
  );
};

export default SalesList;
