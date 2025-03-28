import React from 'react';
import PropTypes from 'prop-types';
import { formatCNPJ } from "../../../../../utils/formatters";
import { EditableField } from "../../../../../Components/ui/Form";
import { Grid, Column } from "../../../../../Components/ui/Layout";
import { useAlert } from '../../../../../contexts/alert/AlertContext';

const InformacoesEmpresa = ({ 
  cliente, 
  editingField,
  startEdit,
  cancelEdit,
  saveEdit,
  editRef,
  setEditValue,
  setCliente,
  id,
  buscarEnderecoPorCEP,
  setSearchUf,
  setSearchUfInternal,
  setOriginalUf,
  setSearchCidade,
  setSearchCidadeInternal,
  setOriginalCidade
}) => {
  const { addAlert } = useAlert();

  return (
    <div className="detalhe-section">
      <h2>Informações da Empresa</h2>
      <Grid container spacing="medium">
        <Column xs={12} md={6}>
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
            isCnpjField={true}
            cliente={cliente}
            setCliente={setCliente}
            id={id}
            addAlert={addAlert}
          />
        </Column>
        <Column xs={12} md={6}>
          <EditableField 
            label="Razão Social" 
            field="razao_social" 
            value={cliente.razao_social}
            editingField={editingField}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            editRef={editRef}
            setEditValue={setEditValue}
            cliente={cliente}
            setCliente={setCliente}
            id={id}
            addAlert={addAlert}
          />
        </Column>
        <Column xs={12} md={6}>
          <EditableField 
            label="Nome Fantasia" 
            field="nome_fantasia" 
            value={cliente.nome_fantasia}
            editingField={editingField}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            editRef={editRef}
            setEditValue={setEditValue}
            cliente={cliente}
            setCliente={setCliente}
            id={id}
            addAlert={addAlert}
          />
        </Column>
        <Column xs={12} md={6}>
          <EditableField 
            label="Email Financeiro" 
            field="email_financeiro" 
            value={cliente.email_financeiro}
            editingField={editingField}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            editRef={editRef}
            setEditValue={setEditValue}
            cliente={cliente}
            setCliente={setCliente}
            id={id}
            addAlert={addAlert}
          />
        </Column>
      </Grid>
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
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, 
  setCliente: PropTypes.func.isRequired,
  buscarEnderecoPorCEP: PropTypes.func,
  setSearchUf: PropTypes.func,
  setSearchUfInternal: PropTypes.func,
  setOriginalUf: PropTypes.func,
  setSearchCidade: PropTypes.func,
  setSearchCidadeInternal: PropTypes.func,
  setOriginalCidade: PropTypes.func
};

export default InformacoesEmpresa;