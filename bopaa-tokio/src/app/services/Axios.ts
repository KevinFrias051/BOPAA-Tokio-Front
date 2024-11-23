/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
export const baseURL= 'http://localhost:8080';
const clienteAxios = axios.create({
  baseURL,
});


export default clienteAxios;