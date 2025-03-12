import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../../utils/formatters';
import EditableField from '../components/EditableField';

/**
 * Seção de informações do responsável pelo cliente
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.cliente - Dados do cliente
 * @param {string} props.editingField - Campo em edição no momento
 * @param {Function} props.startEdit - Função para iniciar edição
 * @param {Function} props.cancelEdit - Função para cancelar edição
 * @param {Function} props.saveEdit - Função para salvar edição
 * @param {Object} props.editRef - Referência ao elemento de edição
 * @param {Function} props.setEditValue - Função para atualizar valor em edição
 * @returns {JSX.Element} Seção do responsável
 */
const Responsavel = ({ 
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
      <h2>Responsável</h2>
      
      <div className="responsavel-row">
        <div className="responsavel-nome">
          <EditableField 
            label="Nome" 
            field="responsavel_nome" 
            value={cliente.responsavel_nome}
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
        <div className="responsavel-data">
          <EditableField 
            label="Data de Nascimento" 
            field="responsavel_data_nascimento" 
            value={formatDate(cliente.responsavel_data_nascimento)}
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
      
      <div className="email-row">
        <div className="email-container">
          <EditableField 
            label="Email" 
            field="responsavel_email" 
            value={cliente.responsavel_email}
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
        <div className="estado-civil-container">
          <EditableField 
            label="Estado Civil" 
            field="responsavel_estado_civil" 
            value={cliente.responsavel_estado_civil}
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
      
      <div className="info-grid two-columns">
        <EditableField 
          label="CPF" 
          field="responsavel_cpf" 
          value={cliente.responsavel_cpf}
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
          label="RG" 
          field="responsavel_rg" 
          value={cliente.responsavel_rg}
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

Responsavel.propTypes = {
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

export default Responsavel;