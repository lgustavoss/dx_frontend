import React from 'react';
import PropTypes from 'prop-types';
import { formatCEP } from '../../../../utils/formatters';
import EditableField from '../components/EditableField';
import { CidadeDropdown } from '../../Common/CidadeDropdown';
import { UFDropdown } from '../../Common/UFDropdown';

/**
 * Seção de endereço do cliente
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.cliente - Dados do cliente
 * @param {Function} props.setCliente - Função para atualizar os dados do cliente
 * @param {string} props.editingField - Campo em edição no momento
 * @param {Function} props.startEdit - Função para iniciar edição
 * @param {Function} props.cancelEdit - Função para cancelar edição
 * @param {Function} props.saveEdit - Função para salvar edição
 * @param {Object} props.editRef - Referência ao elemento de edição
 * @param {Function} props.setEditValue - Função para atualizar valor em edição
 * @param {Function} props.buscarEnderecoPorCEP - Função para buscar endereço por CEP
 * @param {Function} props.handleSelectUf - Função para selecionar UF
 * @param {Function} props.handleSelectCidade - Função para selecionar cidade
 * @param {Array} props.ufs - Lista de UFs disponíveis
 * @param {Array} props.cidades - Lista de cidades disponíveis
 * @param {string} props.selectedUf - UF selecionada
 * @param {string} props.searchUf - Texto de pesquisa para UF
 * @param {string} props.searchCidade - Texto de pesquisa para cidade
 * @param {Function} props.setSearchUfInternal - Função para atualizar pesquisa de UF
 * @param {Function} props.setSearchCidadeInternal - Função para atualizar pesquisa de cidade
 * @param {string} props.originalUf - Valor original da UF
 * @param {string} props.originalCidade - Valor original da cidade
 * @param {Function} props.setOriginalUf - Função para atualizar valor original da UF
 * @param {Function} props.setOriginalCidade - Função para atualizar valor original da cidade
 * @param {boolean} props.showUfDropdown - Estado de exibição do dropdown de UF
 * @param {boolean} props.showCidadeDropdown - Estado de exibição do dropdown de cidade
 * @param {Function} props.setShowUfDropdown - Função para atualizar estado de exibição do dropdown de UF
 * @param {Function} props.setShowCidadeDropdown - Função para atualizar estado de exibição do dropdown de cidade
 * @param {Object} props.ufRef - Referência ao elemento de UF
 * @param {Object} props.cidadeRef - Referência ao elemento de cidade
 * @param {Object} props.searchUfRef - Referência ao campo de pesquisa de UF
 * @param {Object} props.searchCidadeRef - Referência ao campo de pesquisa de cidade
 * @param {Function} props.fetchUFs - Função para buscar UFs
 * @param {Function} props.addAlert - Função para adicionar alertas
 * @returns {JSX.Element} Seção de endereço
 */
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
  addAlert
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
          id={cliente.id}
          addAlert={addAlert}
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
  addAlert: PropTypes.func.isRequired
};

export default Endereco;