import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Typography } from 'antd';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import axios from 'axios';
import '../styles/Dashboard.css';

const { Title, Text } = Typography;

const COLORS = ['#4a6bff', '#ff7d4a', '#28a745', '#ffc107', '#dc3545'];

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, stockRes, purchaseRes] = await Promise.all([
          axios.get('http://localhost:3001/sales'),
          axios.get('http://localhost:3001/stocks'),
          axios.get('http://localhost:3001/purchases'),
        ]);

        setSalesData(salesRes.data);
        setStockData(stockRes.data);
        setPurchaseData(purchaseRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = salesData.reduce((sum, sale) => sum + (sale.profit || (sale.total - sale.hpp)), 0);
  const totalPurchases = purchaseData.reduce((sum, purchase) => sum + (purchase.total || (purchase.quantity * purchase.purchasePrice)), 0);
  const totalProducts = [...new Set(stockData.map(item => item.name))].length;

  const salesByMonth = salesData.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('id-ID', { month: 'short' });
    if (!acc[month]) acc[month] = 0;
    acc[month] += sale.total;
    return acc;
  }, {});

  const salesChartData = Object.entries(salesByMonth).map(([month, sales]) => ({
    name: month,
    sales,
  }));

  const productDistribution = stockData.reduce((acc, item) => {
    if (!acc[item.name]) acc[item.name] = 0;
    acc[item.name] += item.quantity;
    return acc;
  }, {});

  const pieChartData = Object.entries(productDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const stockSummary = stockData.reduce((acc, item) => {
    if (!acc[item.name]) acc[item.name] = 0;
    acc[item.name] += item.quantity;
    return acc;
  }, {});

  const stockTableData = Object.entries(stockSummary)
    .map(([name, quantity]) => ({
      key: name,
      name,
      quantity,
      status: quantity > 20 ? 'Aman' : quantity > 5 ? 'Perhatian' : 'Sedikit',
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const columns = [
    {
      title: 'Nama Barang',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Stok Tersedia',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => quantity.toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === 'Aman') color = 'green';
        else if (status === 'Perhatian') color = 'orange';
        else color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const recentSales = [...salesData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(sale => ({
      ...sale,
      date: new Date(sale.date).toLocaleDateString('id-ID'),
    }));

  return (
    <div className="dashboard-container">
      <Title level={2} className="dashboard-title">Dashboard Toko Kita</Title>
      
      <Row gutter={[16, 16]} className="dashboard-cards">
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} className="stats-card" hoverable>
            <Statistic 
              title="Total Penjualan" 
              value={totalSales} 
              prefix="Rp" 
              valueStyle={{ color: '#4a6bff' }}
              formatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
            />
            <Text type="secondary">Bulan ini</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} className="stats-card" hoverable>
            <Statistic 
              title="Total Laba" 
              value={totalProfit} 
              prefix="Rp" 
              valueStyle={{ color: '#4a6bff' }}
              formatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
            />
            <Progress percent={Math.min(100, (totalProfit / totalSales * 100) || 0)} 
              status="active" 
              strokeColor="#4a6bff"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} className="stats-card" hoverable>
            <Statistic 
              title="Total Pembelian" 
              value={totalPurchases} 
              prefix="Rp" 
              valueStyle={{ color: '#ff7d4a' }}
              formatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
            />
            <Text type="secondary">Bulan ini</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} className="stats-card" hoverable>
            <Statistic 
              title="Jumlah Produk" 
              value={totalProducts} 
              valueStyle={{ color: '#ffc107' }}
            />
            <Text type="secondary">Total item berbeda</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-charts">
        <Col xs={24} md={16}>
          <Card 
            title="Penjualan Bulanan" 
            className="chart-card"
            loading={loading}
            hoverable
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `Rp${(value/1000).toLocaleString()}k`}
                />
                <Tooltip 
                  formatter={(value) => [`Rp${new Intl.NumberFormat('id-ID').format(value)}`, 'Penjualan']}
                />
                <Bar dataKey="sales" fill="#4a6bff" name="Penjualan" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            title="Distribusi Produk" 
            className="chart-card"
            loading={loading}
            hoverable
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} unit`, 'Jumlah']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-tables">
        <Col xs={24} md={12}>
          <Card 
            title="Produk dengan Stok Terbanyak" 
            className="table-card"
            loading={loading}
            hoverable
          >
            <Table 
              columns={columns} 
              dataSource={stockTableData} 
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Penjualan Terakhir" 
            className="table-card"
            loading={loading}
            hoverable
          >
            <Table 
              columns={[
                { title: 'Tanggal', dataIndex: 'date', key: 'date' },
                { title: 'Produk', dataIndex: 'name', key: 'name' },
                { 
                  title: 'Jumlah', 
                  dataIndex: 'quantity', 
                  key: 'quantity',
                  render: (val) => `${val} unit`
                },
                { 
                  title: 'Total', 
                  dataIndex: 'total', 
                  key: 'total',
                  render: (val) => `Rp${new Intl.NumberFormat('id-ID').format(val)}`
                },
              ]} 
              dataSource={recentSales} 
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;