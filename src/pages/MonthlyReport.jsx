import { useEffect, useState } from 'react';
import { Typography, Table, Card } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const MonthlyReport = () => {
//   const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [profitByMonth, setProfitByMonth] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [salesRes, stockRes] = await Promise.all([
        axios.get('http://localhost:3001/sales'),
        axios.get('http://localhost:3001/stocks'),
      ]);

    //   setSalesData(salesRes.data);
      setStockData(stockRes.data);

      const grouped = {};

      salesRes.data.forEach((sale) => {
        const month = dayjs(sale.date).format('YYYY-MM');
        if (!grouped[month]) grouped[month] = { total: 0, hpp: 0 };
        grouped[month].total += sale.total;
        grouped[month].hpp += sale.hpp;
      });

      const chartData = Object.entries(grouped).map(([month, { total, hpp }]) => ({
        month,
        revenue: total,
        hpp,
        profit: total - hpp,
      }));

      setProfitByMonth(chartData);
    };

    fetchData();
  }, []);

  const stockSummary = stockData.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = 0;
    }
    acc[item.name] += item.quantity;
    return acc;
  }, {});

  const stockTableData = Object.entries(stockSummary).map(([name, quantity]) => ({
    key: name,
    name,
    quantity,
  }));

  const stockColumns = [
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    { title: 'Sisa Stok', dataIndex: 'quantity', key: 'quantity' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Typography.Title level={3}>Laporan Laba Bulanan</Typography.Title>

      <Card style={{ marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(val) => `Rp${val}`} />
            <Bar dataKey="profit" fill="#52c41a" name="Laba" />
            <Bar dataKey="revenue" fill="#1890ff" name="Penjualan" />
            <Bar dataKey="hpp" fill="#f5222d" name="HPP" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Typography.Title level={4}>Sisa Stok per Barang</Typography.Title>
      <Table
        columns={stockColumns}
        dataSource={stockTableData}
        pagination={{ pageSize: 5 }}
        style={{ maxWidth: 600 }}
      />
    </div>
  );
};

export default MonthlyReport;
