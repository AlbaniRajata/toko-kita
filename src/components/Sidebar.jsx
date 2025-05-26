import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  ShopOutlined, 
  LineChartOutlined, 
  UnorderedListOutlined, 
  PlusOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img src="/assets/logo.png" alt="Logo Toko Kita" className="sidebar-logo" />
        <h3>Toko Kita</h3>
      </div>
      <div className="sidebar-menu">
        <Link 
          to="/" 
          className={`sidebar-menu-item ${isActive('/') ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          <HomeOutlined className="sidebar-icon" />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/purchase" 
          className={`sidebar-menu-item ${isActive('/purchase') ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          <ShoppingCartOutlined className="sidebar-icon" />
          <span>Pembelian</span>
        </Link>
        <Link 
          to="/sales" 
          className={`sidebar-menu-item ${isActive('/sales') ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          <ShopOutlined className="sidebar-icon" />
          <span>Penjualan</span>
        </Link>
        <Link 
          to="/sales-list" 
          className={`sidebar-menu-item ${isActive('/sales-list') ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          <UnorderedListOutlined className="sidebar-icon" />
          <span>Riwayat Penjualan</span>
        </Link>
        <Link 
          to="/purchases-list" 
          className={`sidebar-menu-item ${isActive('/purchases-list') ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          <FileTextOutlined className="sidebar-icon" />
          <span>Riwayat Pembelian</span>
        </Link>
        <Link 
          to="/report" 
          className={`sidebar-menu-item ${isActive('/report') ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          <LineChartOutlined className="sidebar-icon" />
          <span>Laporan</span>
        </Link>
        <Link 
          to="/add-stock" 
          className={`sidebar-menu-item ${isActive('/add-stock') ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          <PlusOutlined className="sidebar-icon" />
          <span>Tambah Stok</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;