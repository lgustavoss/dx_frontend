import { api } from '../axiosConfig';
import { formatCNPJ } from '../utils/formatters';

export const cnpjService = {
  /**
   * Busca dados de empresa por CNPJ
   * @param {string} cnpj - CNPJ a ser consultado
   * @returns {Promise<Object>} - Dados da empresa
   */
  async buscarDadosPorCNPJ(cnpj) {
    if (!cnpj) {
      throw new Error('CNPJ inválido. Digite um CNPJ válido.');
    }
    
    // Remove formatação do CNPJ para enviar para a API
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      throw new Error('CNPJ inválido. O CNPJ deve conter 14 dígitos.');
    }
    
    try {
      const response = await api.get(`/cliente/consulta/cnpj/${cnpjLimpo}/`);
      
      // Log para depuração
      console.log('Resposta da API de CNPJ:', response.data);
      
      // Validação do retorno
      if (!response.data || !response.data.cnpj) {
        throw new Error('CNPJ não encontrado ou dados incompletos.');
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados pelo CNPJ.');
    }
  },
  
  /**
   * Aplica formatação padrão ao CNPJ
   * @param {string} cnpj - CNPJ a ser formatado
   * @returns {string} - CNPJ formatado no padrão 00.000.000/0000-00
   */
  formatCNPJ(cnpj) {
    if (!cnpj) return '';
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length > 14) cnpj = cnpj.substring(0, 14);
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
};