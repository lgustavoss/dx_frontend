import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../../utils/formatters';
import EditableField from '../components/EditableField';

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
  id
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
            id={id}
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
            id={id}
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
            id={id}
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
            id={id}
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
          id={id}
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
          id={id}
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
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setCliente: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired
};

export default Responsavel;