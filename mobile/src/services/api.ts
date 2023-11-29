import axios from 'axios';

// Coloque o IP da sua maquina
const api = axios.create({
  baseURL: 'http://000.000.00.00:3333',
});

export { api };
