/**
 * Funções utilitárias de formatação para uso em toda a aplicação
 */

/**
 * Formata um número de CNPJ para o formato XX.XXX.XXX/XXXX-XX
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} CNPJ formatado ou string vazia se inválido
 */
export function formatCNPJ(cnpj) {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const numericCnpj = cnpj.replace(/\D/g, '');
  
  // Aplica a máscara de CNPJ
  return numericCnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata um número de CEP para o formato XXXXX-XXX
 * @param {string} cep - CEP a ser formatado
 * @returns {string} CEP formatado ou string vazia se inválido
 */
export function formatCEP(cep) {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  const numericCep = cep.replace(/\D/g, '');
  
  // Aplica a máscara de CEP
  return numericCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * @param {string} date - Data no formato ISO ou string vazia
 * @returns {string} Data formatada ou string vazia se inválida
 */
export function formatDate(date) {
  if (!date) return '';
  
  try {
    const [year, month, day] = date.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
}

/**
 * Formata um número de CPF para o formato XXX.XXX.XXX-XX
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} CPF formatado ou string vazia se inválido
 */
export function formatCPF(cpf) {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const numericCpf = cpf.replace(/\D/g, '');
  
  // Aplica a máscara de CPF
  return numericCpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}