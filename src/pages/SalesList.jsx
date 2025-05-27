import React from 'react';
import { Table, Typography, Card } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SalesList.css';

const SalesList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/sales');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { title: 'Tanggal', dataIndex: 'date', key: 'date' },
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    { title: 'Jumlah', dataIndex: 'quantity', key: 'quantity' },
    { 
      title: 'Harga Jual / pcs', 
      dataIndex: 'sellingPrice', 
      key: 'sellingPrice', 
      render: (val) => `Rp${new Intl.NumberFormat('id-ID').format(val)}` 
    },
    { 
      title: 'HPP', 
      dataIndex: 'hpp', 
      key: 'hpp', 
      render: (val) => `Rp${new Intl.NumberFormat('id-ID').format(val)}` 
    },
    { 
      title: 'Total Penjualan', 
      dataIndex: 'total', 
      key: 'total', 
      render: (val) => `Rp${new Intl.NumberFormat('id-ID').format(val)}` 
    },
    { 
      title: 'Profit', 
      dataIndex: 'profit', 
      key: 'profit', 
      render: (val) => `Rp${new Intl.NumberFormat('id-ID').format(val)}` 
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Typography.Title level={3}>Riwayat Penjualan</Typography.Title>
      <Card className="sales-list-card">
        <Table 
          rowKey="id" 
          dataSource={data} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default SalesList;