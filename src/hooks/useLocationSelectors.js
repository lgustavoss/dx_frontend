import { useState, useCallback, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useAlert } from '../contexts/alert/AlertContext';
import { useCliente } from '../contexts/cliente/ClienteContext';

export function useLocationSelectors() {
  // Estados
  const [searchUf, setSearchUf] = useState('');
  const [searchUfInternal, setSearchUfInternal] = useState('');
  const [originalUf, setOriginalUf] = useState('');
  const [searchCidade, setSearchCidade] = useState('');
  const [searchCidadeInternal, setSearchCidadeInternal] = useState('');
  const [originalCidade, setOriginalCidade] = useState('');
  const [showUfDropdown, setShowUfDropdown] = useState(false);
  const [showCidadeDropdown, setShowCidadeDropdown] = useState(false);
  const [selectedUf, setSelectedUf] = useState('');
  const cidadesCache = useRef({});
  
  const ufRef = useRef(null);
  const cidadeRef = useRef(null);
  const searchUfRef = useRef(null);
  const searchCidadeRef = useRef(null);
  
  const { addAlert } = useAlert();
  const { ufs, cidades, fetchUFs, fetchCidadesByUF } = useCliente(); // Usar o ClienteContext
  
  const debouncedUfSearch = useDebounce(searchUfInternal, 300);
  const debouncedCidadeSearch = useDebounce(searchCidadeInternal, 300);

  useEffect(() => {
    setSearchUf(debouncedUfSearch);
  }, [debouncedUfSearch]);

  useEffect(() => {
    setSearchCidade(debouncedCidadeSearch);
  }, [debouncedCidadeSearch]);

  // Substituído por fetchUFs do ClienteContext
  const fetchUFsFromContext = useCallback(async () => {
    if (ufs.length === 0) {
      await fetchUFs();
    }
    return ufs;
  }, [fetchUFs, ufs]);

  // Substituído por fetchCidadesByUF do ClienteContext  
  const fetchCidadesFromContext = useCallback(async (uf) => {
    // Verificar se já temos as cidades em cache
    if (cidadesCache.current[uf]) {
      return cidadesCache.current[uf];
    }
    
    const citiesData = await fetchCidadesByUF(uf);
    cidadesCache.current[uf] = citiesData;
    return citiesData;
  }, [fetchCidadesByUF]);

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
    
    fetchCidadesFromContext(uf.sigla);
    
    return uf;
  }, [fetchCidadesFromContext]);

  const handleSelectCidade = useCallback((cidade) => {
    setSearchCidade(cidade.nome);
    setSearchCidadeInternal(cidade.nome);
    setOriginalCidade(cidade.nome);
    setShowCidadeDropdown(false);
    
    return cidade;
  }, []);

  return {
    ufs,
    cidades,
    selectedUf,
    setSelectedUf,
    searchUf,
    setSearchUf,
    searchCidade,
    setSearchCidade,
    searchUfInternal,
    setSearchUfInternal,
    searchCidadeInternal,
    setSearchCidadeInternal,
    originalUf,
    setOriginalUf,
    originalCidade,
    setOriginalCidade,
    showUfDropdown,
    setShowUfDropdown,
    showCidadeDropdown,
    setShowCidadeDropdown,
    ufRef,
    cidadeRef,
    searchUfRef,
    searchCidadeRef,
    fetchUFs: fetchUFsFromContext,
    fetchCidades: fetchCidadesFromContext,
    handleSelectUf,
    handleSelectCidade,
    addAlert
  };
}

export default useLocationSelectors;