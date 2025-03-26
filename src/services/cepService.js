import { api } from '../axiosConfig';
import { formatCEP } from '../utils/formatters';

export const cepService = {
  /**
   * Busca endereço por CEP
   * @param {string} cep - CEP a ser consultado
   * @returns {Promise<Object>} - Dados do endereço
   */
  async buscarEnderecoPorCEP(cep) {
    if (!cep || cep.replace(/\D/g, '').length < 8) {
      throw new Error('CEP inválido. Digite um CEP com 8 dígitos.');
    }
    
    // Limpa o CEP, removendo caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');
    
    try {
      const response = await api.get(`/cliente/consulta/cep/${cepLimpo}/`);
      
      // Log para depuração
      console.log('Resposta da API de CEP:', response.data);
      
      if (!response.data || !response.data.cidade || !response.data.estado) {
        throw new Error('CEP não encontrado ou endereço incompleto.');
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar endereço pelo CEP.');
    }
  },
  
  /**
   * Aplica formatação padrão ao CEP
   * @param {string} cep - CEP a ser formatado
   * @returns {string} - CEP formatado no padrão 00000-000
   */
  formatCEP(cep) {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    if (cep.length > 8) cep = cep.substring(0, 8);
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
};