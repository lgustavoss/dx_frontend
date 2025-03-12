import React from 'react';
import PropTypes from 'prop-types';
import { formatCNPJ } from '../../../../utils/formatters';
import EditableField from '../components/EditableField';

/**
 * Seção de Informações da Empresa
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.cliente - Dados do cliente
 * @param {string} props.editingField - Campo em edição no momento
 * @param {Function} props.startEdit - Função para iniciar edição
 * @param {Function} props.cancelEdit - Função para cancelar edição
 * @param {Function} props.saveEdit - Função para salvar edição
 * @param {Object} props.editRef - Referência ao elemento de edição
 * @param {Function} props.setEditValue - Função para atualizar valor em edição
 * @returns {JSX.Element} Seção de informações da empresa
 */
const InformacoesEmpresa = ({ 
  cliente, 
  editingField,
  startEdit,
  cancelEdit,
  saveEdit,
  editRef,
  setEditValue,
  setCliente,
  addAlert,
  id  // Adicionando id aqui
}) => {
  return (
    <div className="detalhe-section">
      <h2>Informações da Empresa</h2>
      
      <EditableField 
        label="Razão Social" 
        field="razao_social" 
        value={cliente.razao_social} 
        fullWidth={true}
        editingField={editingField}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        editRef={editRef}
        setEditValue={setEditValue}
        setCliente={setCliente}
        addAlert={addAlert}
        id={id}  // Passando id para o componente EditableField
        cliente={cliente}
      />
      
      <EditableField 
        label="Nome Fantasia" 
        field="nome_fantasia" 
        value={cliente.nome_fantasia}
        fullWidth={true}
        editingField={editingField}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        editRef={editRef}
        setEditValue={setEditValue}
        setCliente={setCliente}
        addAlert={addAlert}
        id={id}  // Passando id para o componente EditableField
        cliente={cliente}
      />
      
      <div className="info-grid two-columns">
        <EditableField 
          label="CNPJ" 
          field="cnpj" 
          value={formatCNPJ(cliente.cnpj)}
          editingField={editingField}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          editRef={editRef}
          setEditValue={setEditValue}
          setCliente={setCliente}
          addAlert={addAlert}
          id={id}  // Passando id para o componente EditableField
          cliente={cliente}
        />
        
        <EditableField 
          label="Email Financeiro" 
          field="email_financeiro" 
          value={cliente.email_financeiro || ''}
          editingField={editingField}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          editRef={editRef}
          setEditValue={setEditValue}
          setCliente={setCliente}
          addAlert={addAlert}
          id={id}  // Passando id para o componente EditableField
          cliente={cliente}
        />
      </div>
    </div>
  );
};

InformacoesEmpresa.propTypes = {
  cliente: PropTypes.object.isRequired,
  editingField: PropTypes.string,
  startEdit: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  saveEdit: PropTypes.func.isRequired,
  editRef: PropTypes.object.isRequired,
  setEditValue: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Nova prop
  setCliente: PropTypes.func.isRequired, // Nova prop
  addAlert: PropTypes.func.isRequired // Nova prop
};

export default InformacoesEmpresa;