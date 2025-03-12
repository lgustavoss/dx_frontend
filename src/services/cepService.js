import { api } from '../axiosConfig';

export const cepService = {
  async buscarEnderecoPorCEP(cep) {
    if (!cep || cep.length < 8) {
      throw new Error('CEP inválido. Digite um CEP com 8 dígitos.');
    }
    
    const response = await api.get(`/cliente/consulta/cep/${cep}/`);
    return response.data;
  },
  
  formatCEP(cep) {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
};