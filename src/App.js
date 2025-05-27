import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import AddStockPage from './pages/AddStockPage';
import PurchasePage from './pages/PurchasePage';
import SalesPage from './pages/SalesPage';
import SalesList from './pages/SalesList';
import PurchasesList from './pages/PurchasesList';
import MonthlyReport from './pages/MonthlyReport';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <MenuOutlined />
          </button>
          <div className='content'>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/add-stock" element={<AddStockPage />} />
              <Route path="/purchase" element={<PurchasePage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/sales-list" element={<SalesList />} />
              <Route path="/purchases-list" element={<PurchasesList />} />
              <Route path="/report" element={<MonthlyReport />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;