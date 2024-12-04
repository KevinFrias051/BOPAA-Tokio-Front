/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
export const baseURL = 
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001' // Acceso externo para el navegador
    : 'http://backend:3001';  // Acceso interno desde Docker
    
const clienteAxios = axios.create({
  baseURL,
});


export default clienteAxios;