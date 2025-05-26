import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddStockPage from './pages/AddStockPage';
import PurchasePage from './pages/PurchasePage';
import SalesPage from './pages/SalesPage';
import SalesList from './pages/SalesList';
import PurchasesList from './pages/PurchasesList';
import MonthlyReport from './pages/MonthlyReport';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddStockPage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/sales-list" element={<SalesList />} />
        <Route path="/purchases-list" element={<PurchasesList />} />
        <Route path="/report" element={<MonthlyReport />} />
      </Routes>
    </Router>
  );
}

export default App;

