import { useEffect, useState } from 'react';
import { Typography, Table, Card, Row, Col, Statistic } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

import '../styles/MonthlyReport.css'; // Pastikan path ini sesuai dengan struktur folder kamu

const MonthlyReport = () => {
  const [stockData, setStockData] = useState([]);
  const [profitByMonth, setProfitByMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesRes, stockRes] = await Promise.all([
          axios.get('http://localhost:3001/sales'),
          axios.get('http://localhost:3001/stocks'),
        ]);

        setStockData(stockRes.data);

        const grouped = {};
        let totalProfitSum = 0;

        salesRes.data.forEach((sale) => {
          const month = dayjs(sale.date).format('MMMM YYYY');
          if (!grouped[month]) grouped[month] = { revenue: 0, hpp: 0, profit: 0 };
          grouped[month].revenue += sale.total;
          grouped[month].hpp += sale.hpp;
          grouped[month].profit += (sale.total - sale.hpp);
          totalProfitSum += (sale.total - sale.hpp);
        });

        const chartData = Object.entries(grouped).map(([month, values]) => ({
          month,
          ...values
        }));

        setProfitByMonth(chartData);
        setTotalProfit(totalProfitSum);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const stockColumns = [
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    {
      title: 'Sisa Stok',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => quantity.toLocaleString()
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="monthly-report-container">
      <Typography.Title level={3} className="monthly-report-title">
        Laporan Bulanan
      </Typography.Title>

      <Row gutter={16} style={{ marginBottom: '2rem' }}>
        <Col span={12}>
          <Card className="monthly-report-card">
            <Statistic
              title="Total Laba Keseluruhan"
              value={totalProfit}
              formatter={(val) => formatCurrency(val)}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="monthly-report-card">
            <Statistic
              title="Total Bulan Dilaporkan"
              value={profitByMonth.length}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Grafik Laba Bulanan (Pendapatan - HPP)"
        loading={loading}
        className="monthly-report-card"
        style={{ marginBottom: '2rem' }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={profitByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(val) => `Rp${(val / 1000).toLocaleString()}k`}
            />
            <Tooltip
              formatter={(val, name) => {
                const formattedVal = formatCurrency(val);
                if (name === 'profit') return [formattedVal, 'Laba'];
                if (name === 'revenue') return [formattedVal, 'Pendapatan'];
                return [formattedVal, 'HPP'];
              }}
              labelFormatter={(month) => `Bulan: ${month}`}
            />
            <Legend />
            <Bar
              dataKey="profit"
              fill="#52c41a"
              name="Laba (Pendapatan - HPP)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card
        title="Sisa Stok per Barang"
        loading={loading}
        className="monthly-report-card"
      >
        <Table
          columns={stockColumns}
          dataSource={stockTableData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          bordered
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total Barang</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {stockTableData.length}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
};

export default MonthlyReport;
