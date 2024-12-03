/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
export const baseURL= 'http://backend:3001';
const clienteAxios = axios.create({
  baseURL,
});


export default clienteAxios;