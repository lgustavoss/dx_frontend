import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../axiosConfig';
import { useDebounce } from './useDebounce';
import { useAlert } from '../Components/ui/Feedback/Alert/AlertContext';

export function useLocationSelectors() {
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [selectedUf, setSelectedUf] = useState('');
  const [searchUfInternal, setSearchUfInternal] = useState('');
  const [searchCidadeInternal, setSearchCidadeInternal] = useState('');
  const [searchUf, setSearchUf] = useState('');
  const [searchCidade, setSearchCidade] = useState('');
  const [originalUf, setOriginalUf] = useState('');
  const [originalCidade, setOriginalCidade] = useState('');
  const [showUfDropdown, setShowUfDropdown] = useState(false);
  const [showCidadeDropdown, setShowCidadeDropdown] = useState(false);
  
  const ufRef = useRef(null);
  const cidadeRef = useRef(null);
  const searchUfRef = useRef(null);
  const searchCidadeRef = useRef(null);
  const cidadesCache = useRef({});
  const { addAlert } = useAlert();
  
  const debouncedUfSearch = useDebounce(searchUfInternal, 300);
  const debouncedCidadeSearch = useDebounce(searchCidadeInternal, 300);

  useEffect(() => {
    setSearchUf(debouncedUfSearch);
  }, [debouncedUfSearch]);

  useEffect(() => {
    setSearchCidade(debouncedCidadeSearch);
  }, [debouncedCidadeSearch]);

  // Otimizar a busca de UFs com cache
  const fetchUFs = useCallback(async () => {
    // Evitar chamadas repetidas se já temos dados
    if (ufs.length > 0) {
      return ufs;
    }
    
    try {
      const response = await api.get('/cliente/consulta/ufs/');
      setUfs(response.data);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar UFs:', err);
      addAlert('Erro ao carregar lista de estados.', 'error');
      return [];
    }
  }, [ufs.length, addAlert]);

  // Implementar cache para cidades
  const fetchCidades = useCallback(async (uf) => {
    // Verificar se já temos as cidades em cache
    if (cidadesCache.current[uf]) {
      setCidades(cidadesCache.current[uf]);
      return cidadesCache.current[uf];
    }
    
    try {
      const response = await api.get(`/cliente/consulta/municipios/${uf}/`);
      cidadesCache.current[uf] = response.data;
      setCidades(response.data);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar municípios:', err);
      addAlert('Erro ao carregar lista de cidades.', 'error');
      return [];
    }
  }, [addAlert]);

  // Funções para manipular seleção de UF e cidade
  const handleSelectUf = useCallback((uf) => {
    setSelectedUf(uf.sigla);
    setSearchUf(uf.sigla);
    setSearchUfInternal(uf.sigla);
    setOriginalUf(uf.sigla);
    setShowUfDropdown(false);
    
    setSearchCidade('');
    setSearchCidadeInternal('');
    setOriginalCidade('');
    
    fetchCidades(uf.sigla);
    
    return uf;
  }, [fetchCidades]);

  const handleSelectCidade = useCallback((cidade) => {
    setSearchCidade(cidade.nome);
    setSearchCidadeInternal(cidade.nome);
    setOriginalCidade(cidade.nome);
    setShowCidadeDropdown(false);
    
    return cidade;
  }, []);

  return {
    ufs,
    setUfs,
    cidades,
    setCidades,
    selectedUf,
    setSelectedUf,
    searchUf,
    setSearchUf,
    searchCidade,
    setSearchCidade,
    searchUfInternal,
    searchCidadeInternal,
    setSearchUfInternal,
    setSearchCidadeInternal,
    originalUf,
    originalCidade,
    setOriginalUf,
    setOriginalCidade,
    showUfDropdown,
    showCidadeDropdown,
    setShowUfDropdown,
    setShowCidadeDropdown,
    ufRef,
    cidadeRef,
    searchUfRef,
    searchCidadeRef,
    fetchUFs,
    fetchCidades,
    handleSelectUf,
    handleSelectCidade
  };
}

export default useLocationSelectors;