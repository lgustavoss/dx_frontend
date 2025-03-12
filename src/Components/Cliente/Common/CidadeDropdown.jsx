import { useEffect, memo } from 'react';
import './Dropdowns.css';

export const CidadeDropdown = memo(({
  cidades,
  searchCidade,
  setSearchCidadeInternal,
  originalCidade,
  setOriginalCidade,
  showCidadeDropdown,
  setShowCidadeDropdown,
  handleSelectCidade,
  cidadeRef,
  searchCidadeRef,
  selectedUf
}) => {
  const filteredCidades = searchCidade 
    ? cidades.filter(cidade => cidade.nome.toLowerCase().includes(searchCidade.toLowerCase()))
    : cidades;
  
  const handleToggleDropdown = () => {
    if (!showCidadeDropdown && selectedUf) {
      setOriginalCidade(searchCidade);
      setSearchCidadeInternal('');
      setShowCidadeDropdown(true);
    } else if (showCidadeDropdown) {
      setShowCidadeDropdown(false);
    }
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchCidadeInternal(value);
  };
  
  const handleSelectCidadeAndClose = (cidade) => {
    console.log("Selecionando cidade:", cidade);
    // Chama a função de manipulação da seleção de cidade
    handleSelectCidade(cidade);
  };
  
  useEffect(() => {
    if (showCidadeDropdown && searchCidadeRef.current) {
      searchCidadeRef.current.focus();
    }
  }, [showCidadeDropdown, searchCidadeRef]);
  
  return (
    <div className="dropdown-field cidade-dropdown" ref={cidadeRef}>
      <label>Cidade:</label>
      <div className="dropdown-input-container">
        <input
          ref={searchCidadeRef}
          type="text"
          value={searchCidade}
          onChange={handleInputChange}
          onFocus={() => selectedUf && setShowCidadeDropdown(true)}
          disabled={!selectedUf}
          placeholder={selectedUf ? "Selecione ou pesquise" : "Selecione uma UF primeiro"}
          className="dropdown-input"
        />
        <button 
          className="dropdown-toggle"
          onClick={handleToggleDropdown}
          type="button"
          disabled={!selectedUf}
        >
          ▼
        </button>
      </div>
      {showCidadeDropdown && filteredCidades.length > 0 && (
        <div className="dropdown-list">
          {filteredCidades.map((cidade) => (
            <div 
              key={cidade.id}
              className="dropdown-item"
              onClick={() => handleSelectCidadeAndClose(cidade)}
            >
              {cidade.nome}
            </div>
          ))}
        </div>
      )}
      {showCidadeDropdown && filteredCidades.length === 0 && (
        <div className="dropdown-list">
          <div className="dropdown-item">Nenhuma cidade encontrada</div>
        </div>
      )}
    </div>
  );
});

export default CidadeDropdown;