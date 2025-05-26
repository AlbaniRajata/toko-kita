import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const addStock = (stockData) => axios.post(`${API_URL}/stocks`, stockData);

export const addPurchase = (purchaseData) => axios.post(`${API_URL}/purchases`, purchaseData);
