import { useState } from 'react';
import { useAlert } from '../contexts/alert/AlertContext'; 
import { cepService } from '../services/cepService';

/**
 * Hook personalizado para buscar e processar dados de CEP
 * 
 * @returns {Object} Funções e estados relacionados à busca de CEP
 */
export function useCepSearch() {
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const { addAlert } = useAlert();

  const buscarIdsDaLocalizacao = async (endereco) => {
    try {
      const ufsResponse = await api.get('/cliente/consulta/ufs/');
      const ufs = ufsResponse.data;
      const ufSelecionada = ufs.find(uf => uf.sigla === endereco.estado);
      if (!ufSelecionada) {
        addAlert(`UF não encontrada: ${endereco.estado}`, 'error');
        return null;
      }
      const cidadesResponse = await api.get(`/cliente/consulta/municipios/${ufSelecionada.sigla}/`);
      const cidades = cidadesResponse.data;
      const cidadeSelecionada = cidades.find(cidade => cidade.nome.toLowerCase() === endereco.cidade.toLowerCase());
      if (!cidadeSelecionada) {
        addAlert(`Cidade não encontrada: ${endereco.cidade}`, 'error');
        return null;
      }
      return { ufSelecionada, cidadeSelecionada };
    } catch (error) {
      console.error('Erro ao buscar IDs de localização:', error);
      addAlert('Erro ao buscar dados de cidade e estado.', 'error');
      return null;
    }
  };

  const processarCep = async (cepValue) => {
    setIsSearchingCep(true);
    addAlert('Buscando endereço...', 'info');
    try {
      const endereco = await cepService.buscarEnderecoPorCEP(cepValue);
      if (!endereco) {
        return null;
      }
      const localizacao = await buscarIdsDaLocalizacao(endereco);
      if (!localizacao) {
        return null;
      }
      return {
        cep: cepValue.replace(/\D/g, ''),
        endereco: endereco.endereco || '',
        cidade_id: localizacao.cidadeSelecionada.id,
        cidade_nome: localizacao.cidadeSelecionada.nome,
        estado_id: localizacao.ufSelecionada.id,
        estado_sigla: localizacao.ufSelecionada.sigla
      };
    } catch (error) {
      console.error('Erro ao processar CEP:', error);
      addAlert('Erro ao processar dados do CEP.', 'error');
      return null;
    } finally {
      setIsSearchingCep(false);
    }
  };

  return {
    isSearchingCep,
    processarCep
  };
}