import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const addStock = (stockData) => {
  return axios.post(`${API_URL}/stocks`, stockData);
};
