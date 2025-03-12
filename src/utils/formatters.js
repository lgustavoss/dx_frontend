/**
 * Formata um CEP para o padrão brasileiro (00000-000)
 * @param {string} cep - CEP a ser formatado
 * @returns {string} CEP formatado
 */
export function formatCEP(cep) {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
  
  /**
   * Formata uma data para o padrão brasileiro (DD/MM/YYYY)
   * @param {string} dateString - Data em formato ISO ou string válida para o construtor Date
   * @returns {string} Data formatada
   */
  export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  /**
   * Formata um CNPJ para o padrão brasileiro (00.000.000/0000-00)
   * @param {string} cnpj - CNPJ a ser formatado
   * @returns {string} CNPJ formatado
   */
  export function formatCNPJ(cnpj) {
    if (!cnpj) return '';
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  
  /**
   * Formata um CPF para o padrão brasileiro (000.000.000-00)
   * @param {string} cpf - CPF a ser formatado
   * @returns {string} CPF formatado
   */
  export function formatCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }