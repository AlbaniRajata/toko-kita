import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddStockPage from './pages/AddStockPage';
import PurchasePage from './pages/PurchasePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddStockPage />} />
        <Route path="/purchase" element={<PurchasePage />} />
      </Routes>
    </Router>
  );
}

export default App;

