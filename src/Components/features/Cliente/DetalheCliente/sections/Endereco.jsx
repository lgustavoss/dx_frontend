import React from 'react';
import PropTypes from 'prop-types';
import { formatCEP } from '../../../../utils/formatters';
import { EditableField } from '../../../../../Components/ui/Form';
import { CidadeDropdown } from '../../../Common/CidadeDropdown';
import { UFDropdown } from '../../../Common/UFDropdown';
const Endereco = ({ 
  cliente,
  setCliente,
  editingField,
  startEdit,
  cancelEdit,
  saveEdit,
  editRef,
  setEditValue,
  buscarEnderecoPorCEP,
  handleSelectUf,
  handleSelectCidade,
  ufs,
  cidades,
  selectedUf,
  searchUf,
  searchCidade,
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
  addAlert,
  id,
  setSearchUf,
  setSearchCidade
}) => {
  return (
    <div className="detalhe-section">
      <h2>Endereço</h2>
      <EditableField 
        label="Endereço" 
        field="endereco" 
        value={cliente.endereco}
        fullWidth={true}
        editingField={editingField}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        editRef={editRef}
        setEditValue={setEditValue}
        setCliente={setCliente}
        id={id}
        addAlert={addAlert}
        cliente={cliente}
      />
      <div className="location-grid">
        <EditableField 
          label="CEP" 
          field="cep" 
          value={formatCEP(cliente.cep)}
          editingField={editingField}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          editRef={editRef}
          setEditValue={setEditValue}
          isCepField={true}
          buscarEnderecoPorCEP={buscarEnderecoPorCEP}
          cliente={cliente}
          setCliente={setCliente}
          handleSelectUf={handleSelectUf}
          handleSelectCidade={handleSelectCidade}
          id={id}
          addAlert={addAlert}
          setSearchUf={setSearchUf}
          setSearchUfInternal={setSearchUfInternal}
          setOriginalUf={setOriginalUf}
          setSearchCidade={setSearchCidade}
          setSearchCidadeInternal={setSearchCidadeInternal}
          setOriginalCidade={setOriginalCidade}
        />
        <UFDropdown 
          ufs={ufs}
          searchUf={searchUf}
          setSearchUfInternal={setSearchUfInternal}
          originalUf={originalUf}
          setOriginalUf={setOriginalUf}
          showUfDropdown={showUfDropdown}
          setShowUfDropdown={setShowUfDropdown}
          handleSelectUf={handleSelectUf}
          ufRef={ufRef}
          searchUfRef={searchUfRef}
          fetchUFs={fetchUFs}
        />
        <CidadeDropdown 
          cidades={cidades}
          searchCidade={searchCidade}
          setSearchCidadeInternal={setSearchCidadeInternal}
          originalCidade={originalCidade}
          setOriginalCidade={setOriginalCidade}
          showCidadeDropdown={showCidadeDropdown}
          setShowCidadeDropdown={setShowCidadeDropdown}
          handleSelectCidade={handleSelectCidade}
          cidadeRef={cidadeRef}
          searchCidadeRef={searchCidadeRef}
          selectedUf={selectedUf}
        />
      </div>
    </div>
  );
};

Endereco.propTypes = {
  cliente: PropTypes.object.isRequired,
  setCliente: PropTypes.func.isRequired,
  editingField: PropTypes.string,
  startEdit: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  saveEdit: PropTypes.func.isRequired,
  editRef: PropTypes.object.isRequired,
  setEditValue: PropTypes.func.isRequired,
  buscarEnderecoPorCEP: PropTypes.func.isRequired,
  handleSelectUf: PropTypes.func.isRequired,
  handleSelectCidade: PropTypes.func.isRequired,
  ufs: PropTypes.array.isRequired,
  cidades: PropTypes.array.isRequired,
  selectedUf: PropTypes.string.isRequired,
  searchUf: PropTypes.string.isRequired,
  searchCidade: PropTypes.string.isRequired,
  setSearchUfInternal: PropTypes.func.isRequired,
  setSearchCidadeInternal: PropTypes.func.isRequired,
  originalUf: PropTypes.string.isRequired,
  originalCidade: PropTypes.string.isRequired,
  setOriginalUf: PropTypes.func.isRequired,
  setOriginalCidade: PropTypes.func.isRequired,
  showUfDropdown: PropTypes.bool.isRequired,
  showCidadeDropdown: PropTypes.bool.isRequired,
  setShowUfDropdown: PropTypes.func.isRequired,
  setShowCidadeDropdown: PropTypes.func.isRequired,
  ufRef: PropTypes.object.isRequired,
  cidadeRef: PropTypes.object.isRequired,
  searchUfRef: PropTypes.object.isRequired,
  searchCidadeRef: PropTypes.object.isRequired,
  fetchUFs: PropTypes.func.isRequired,
  fetchCidades: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSearchUf: PropTypes.func.isRequired,
  setSearchCidade: PropTypes.func.isRequired
};

export default Endereco;