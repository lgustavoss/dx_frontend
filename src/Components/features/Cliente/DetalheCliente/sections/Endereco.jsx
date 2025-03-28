import React from 'react';
import PropTypes from 'prop-types';
import { formatCEP } from "../../../../../utils/formatters";
import { EditableField, SearchableDropdown } from "../../../../../Components/ui/Form";
import { useAlert } from "../../../../../contexts/alert/AlertContext";

const Endereco = ({ 
  cliente,
  editingField,
  startEdit,
  cancelEdit,
  saveEdit,
  editRef,
  setEditValue,
  setCliente,
  id,
  // Props para os dropdowns
  ufs,
  cidades,
  selectedUf,
  searchUf,
  searchCidade,
  setSearchUf,
  setSearchCidade,
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
}) => {
  const { addAlert } = useAlert();

  return (
    <div className="section-container">
      <h3>Endereço</h3>
      
      <div className="location-grid">
        <SearchableDropdown
          ref={ufRef}
          id="uf-dropdown"
          name="uf"
          label="Estado"
          placeholder="Selecione ou pesquise um estado"
          options={ufs}
          value={searchUf}
          onChange={(e) => setSearchUfInternal(e.target.value)}
          onSelect={handleSelectUf}
          displayKey="sigla"
          valueKey="id"
          secondaryKey="nome"
          className="uf-dropdown"
          required
        />

        <SearchableDropdown
          ref={cidadeRef}
          id="cidade-dropdown"
          name="cidade"
          label="Cidade"
          placeholder="Selecione ou pesquise uma cidade"
          options={cidades}
          value={searchCidade}
          onChange={(e) => setSearchCidadeInternal(e.target.value)}
          onSelect={handleSelectCidade}
          displayKey="nome"
          valueKey="id"
          className="cidade-dropdown"
          dependsOn={selectedUf}
          dependencyErrorMessage="Selecione um estado primeiro"
          required
        />
      </div>

      <EditableField
        label="Endereço"
        value={cliente.endereco || ''}
        isEditing={editingField === 'endereco'}
        onStartEdit={() => startEdit('endereco', cliente.endereco || '')}
        onCancel={cancelEdit}
        onSave={saveEdit}
        inputRef={editingField === 'endereco' ? editRef : null}
        onChange={(e) => setEditValue(e.target.value)}
      />

      <EditableField
        label="CEP"
        value={formatCEP(cliente.cep) || ''}
        isEditing={editingField === 'cep'}
        onStartEdit={() => startEdit('cep', cliente.cep || '')}
        onCancel={cancelEdit}
        onSave={saveEdit}
        inputRef={editingField === 'cep' ? editRef : null}
        onChange={(e) => setEditValue(e.target.value)}
        mask="99999-999"
        showSearch
        onSearch={async () => {
          try {
            const cepValue = editValue.replace(/\D/g, '');
            if (cepValue.length !== 8) {
              addAlert('CEP deve conter 8 dígitos', 'error');
              return;
            }
            
            // Código para buscar endereço por CEP
            // ...
          } catch (err) {
            addAlert('Erro ao buscar CEP', 'error');
          }
        }}
      />
    </div>
  );
};

Endereco.propTypes = {
  cliente: PropTypes.object.isRequired,
  editingField: PropTypes.string,
  startEdit: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  saveEdit: PropTypes.func.isRequired,
  editRef: PropTypes.object,
  setEditValue: PropTypes.func.isRequired,
  setCliente: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  
  // Props para os dropdowns
  ufs: PropTypes.array.isRequired,
  cidades: PropTypes.array.isRequired,
  selectedUf: PropTypes.string,
  searchUf: PropTypes.string,
  searchCidade: PropTypes.string,
  setSearchUf: PropTypes.func.isRequired,
  setSearchCidade: PropTypes.func.isRequired,
  setSearchUfInternal: PropTypes.func.isRequired,
  setSearchCidadeInternal: PropTypes.func.isRequired,
  originalUf: PropTypes.string,
  originalCidade: PropTypes.string,
  setOriginalUf: PropTypes.func.isRequired,
  setOriginalCidade: PropTypes.func.isRequired,
  showUfDropdown: PropTypes.bool,
  showCidadeDropdown: PropTypes.bool,
  setShowUfDropdown: PropTypes.func.isRequired,
  setShowCidadeDropdown: PropTypes.func.isRequired,
  ufRef: PropTypes.object,
  cidadeRef: PropTypes.object,
  searchUfRef: PropTypes.object,
  searchCidadeRef: PropTypes.object,
  fetchUFs: PropTypes.func.isRequired,
  fetchCidades: PropTypes.func.isRequired,
  handleSelectUf: PropTypes.func.isRequired,
  handleSelectCidade: PropTypes.func.isRequired
};

export default Endereco;