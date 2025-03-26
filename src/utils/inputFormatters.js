import { formatCNPJ as formatCNPJDisplay, formatCEP as formatCEPDisplay, formatCPF as formatCPFDisplay } from './formatters';

/**
 * Utilitários para formatação de campos de input
 */

/**
 * Formata o valor de input com base no tipo especificado
 * 
 * @param {string} name - Nome do campo
 * @param {string} value - Valor do campo
 * @returns {string} Valor formatado
 */
export const formatInputValue = (name, value) => {
  if (!value) return '';
  
  // Converte para string se não for
  let inputValue = String(value);
  
  switch (name) {
    case 'cnpj':
      return formatCNPJ(inputValue);
    case 'cep':
      return formatCEP(inputValue);
    case 'cpf':
      return formatCPF(inputValue);
    case 'telefone':
      return formatTelefone(inputValue);
    default:
      return inputValue;
  }
};

/**
 * Formata um CNPJ durante a digitação
 * 
 * @param {string} value - Valor do CNPJ
 * @returns {string} CNPJ formatado
 */
export const formatCNPJ = (value) => {
  // Remove caracteres não numéricos
  const rawValue = value.replace(/\D/g, '');
  const truncatedValue = rawValue.substring(0, 14);
  
  return formatCNPJDisplay(truncatedValue);
};

/**
 * Formata um CEP durante a digitação
 * 
 * @param {string} value - Valor do CEP
 * @returns {string} CEP formatado
 */
export const formatCEP = (value) => {
  // Remove caracteres não numéricos
  const rawValue = value.replace(/\D/g, '');
  const truncatedValue = rawValue.substring(0, 8);
  
  return formatCEPDisplay(truncatedValue);
};

/**
 * Formata um CPF durante a digitação
 * 
 * @param {string} value - Valor do CPF
 * @returns {string} CPF formatado
 */
export const formatCPF = (value) => {
  // Remove caracteres não numéricos
  const rawValue = value.replace(/\D/g, '');
  const truncatedValue = rawValue.substring(0, 11);
  
  return formatCPFDisplay(truncatedValue);
};

/**
 * Formata um número de telefone durante a digitação
 * 
 * @param {string} value - Valor do telefone
 * @returns {string} Telefone formatado
 */
export const formatTelefone = (value) => {
  // Remove caracteres não numéricos
  const rawValue = value.replace(/\D/g, '');
  const truncatedValue = rawValue.substring(0, 11);
  
  if (truncatedValue.length <= 2) {
    return truncatedValue;
  } else if (truncatedValue.length <= 6) {
    return truncatedValue.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
  } else if (truncatedValue.length <= 10) {
    return truncatedValue.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    return truncatedValue.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
};