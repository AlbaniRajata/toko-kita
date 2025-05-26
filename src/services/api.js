import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const addStock = (stockData) => axios.post(`${API_URL}/stocks`, stockData);

export const addPurchase = (purchaseData) => axios.post(`${API_URL}/purchases`, purchaseData);

export const addSale = (saleData) => axios.post(`${API_URL}/sales`, saleData);
export const getSortedStocks = (name) =>
  axios.get(`${API_URL}/stocks?name=${name}&_sort=date&_order=asc`);
export const updateStock = (id, data) => axios.patch(`${API_URL}/stocks/${id}`, data);