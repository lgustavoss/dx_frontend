import { useState } from 'react';
import { useAlert } from '../contexts/alert/AlertContext';
import { cnpjService } from '../services/cnpjService';
import { useCepSearch } from './useCepSearch';

/**
 * Hook personalizado para buscar e processar dados de CNPJ
 * 
 * @returns {Object} Funções e estados relacionados à busca de CNPJ
 */
export function useCnpjSearch() {
  const [isSearchingCnpj, setIsSearchingCnpj] = useState(false);
  const { addAlert } = useAlert();
  const { processarCep } = useCepSearch();

  const processarCnpj = async (cnpjValue) => {
    setIsSearchingCnpj(true);
    addAlert('Buscando informações do CNPJ...', 'info');
    try {
      const cnpjLimpo = cnpjValue.replace(/\D/g, '');
      if (cnpjLimpo.length !== 14) {
        addAlert('CNPJ inválido. O CNPJ deve conter 14 dígitos.', 'error');
        return null;
      }
      const dadosCnpj = await cnpjService.buscarDadosPorCNPJ(cnpjLimpo);
      if (!dadosCnpj) {
        addAlert('CNPJ não encontrado.', 'error');
        return null;
      }
      const payload = {
        cnpj: cnpjLimpo,
        razao_social: dadosCnpj.razao_social || '',
        nome_fantasia: dadosCnpj.nome_fantasia || dadosCnpj.razao_social || '',
        endereco: dadosCnpj.endereco || ''
      };
      if (dadosCnpj.cep) {
        const cepLimpo = dadosCnpj.cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
          try {
            const dadosEndereco = await processarCep(cepLimpo);
            if (dadosEndereco) {
              return { ...payload, ...dadosEndereco };
            }
          } catch (cepError) {
            console.error('Erro ao processar CEP do CNPJ:', cepError);
          }
        }
      }
      return payload;
    } catch (error) {
      console.error('Erro ao processar CNPJ:', error);
      addAlert('Erro ao buscar dados por CNPJ. ' + (error.message || ''), 'error');
      return null;
    } finally {
      setIsSearchingCnpj(false);
    }
  };

  return {
    isSearchingCnpj,
    processarCnpj
  };
}