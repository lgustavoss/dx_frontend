import { useEffect, memo, useState } from 'react';
import './Dropdowns.css';

export const UFDropdown = memo(({
  ufs,
  searchUf,
  setSearchUfInternal,
  originalUf,
  setOriginalUf,
  showUfDropdown,
  setShowUfDropdown,
  handleSelectUf,
  ufRef,
  searchUfRef,
  fetchUFs,
  setSearchUf // Adicionando esta prop para acesso direto
}) => {
  // Estado local para controle da pesquisa no dropdown
  const [tempSearch, setTempSearch] = useState('');
  
  // Verificar se ufs contém dados
  const ufsArray = Array.isArray(ufs) ? ufs : [];
  
  // Carregar UFs ao montar o componente caso esteja vazio
  useEffect(() => {
    if (ufsArray.length === 0) {
      fetchUFs();
    }
  }, [ufsArray.length, fetchUFs]);
  
  // Filtra UFs com base na pesquisa temporária quando dropdown aberto
  // ou na pesquisa real quando fechado
  const filteredUFs = showUfDropdown 
    ? tempSearch 
      ? ufsArray.filter(uf => 
          uf.sigla.toLowerCase().includes(tempSearch.toLowerCase()) || 
          uf.nome.toLowerCase().includes(tempSearch.toLowerCase())
        )
      : ufsArray // Mostra todas quando não há pesquisa temporária
    : searchUf 
      ? ufsArray.filter(uf => 
          uf.sigla.toLowerCase().includes(searchUf.toLowerCase()) || 
          uf.nome.toLowerCase().includes(searchUf.toLowerCase())
        )
      : ufsArray;
  
  // Função para abrir o dropdown e preparar a pesquisa
  const handleToggleDropdown = () => {
    if (!showUfDropdown) {
      // Ao abrir, guardamos o valor atual e limpamos a pesquisa temporária
      setOriginalUf(searchUf);
      setTempSearch('');
      setShowUfDropdown(true);
    } else {
      // Ao fechar, restauramos o valor original
      setShowUfDropdown(false);
      setTempSearch('');
    }
  };
  
  // Lidar com mudanças na pesquisa temporária
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (showUfDropdown) {
      // Quando dropdown está aberto, atualiza apenas a pesquisa temporária
      setTempSearch(value);
    } else {
      // Quando fechado, atualiza a pesquisa debounced normal
      setSearchUfInternal(value);
    }
  };
  
  // Selecionar UF e fechar dropdown
  const handleSelectUfAndClose = (uf) => {
    handleSelectUf(uf);
    setTempSearch('');
    setShowUfDropdown(false);
  };
  
  useEffect(() => {
    if (showUfDropdown && searchUfRef.current) {
      searchUfRef.current.focus();
    }
  }, [showUfDropdown, searchUfRef]);
  
  return (
    <div className="dropdown-field uf-dropdown" ref={ufRef}>
      <label>UF:</label>
      <div className="dropdown-input-container">
        <input
          ref={searchUfRef}
          type="text"
          value={showUfDropdown ? tempSearch : searchUf}
          onChange={handleInputChange}
          onFocus={() => setShowUfDropdown(true)}
          placeholder="Selecione ou pesquise"
          className="dropdown-input"
        />
        <button 
          className="dropdown-toggle"
          onClick={handleToggleDropdown}
          type="button"
        >
          ▼
        </button>
      </div>
      {showUfDropdown && (
        <div className="dropdown-list">
          {filteredUFs.length > 0 ? filteredUFs.map((uf) => (
            <div 
              key={uf.id}
              className="dropdown-item"
              onClick={() => handleSelectUfAndClose(uf)}
            >
              {uf.sigla} - {uf.nome}
            </div>
          )) : (
            <div className="dropdown-item">Nenhuma UF encontrada</div>
          )}
        </div>
      )}
    </div>
  );
});

export default UFDropdown;