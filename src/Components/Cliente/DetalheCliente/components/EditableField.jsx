import { useRef, useEffect, useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import { api } from '../../../../axiosConfig';

const EditableField = ({ 
  label, 
  field, 
  value, 
  fullWidth = false, 
  editingField,
  startEdit,
  cancelEdit,
  saveEdit,
  editRef,
  setEditValue,
  isCepField = false,
  buscarEnderecoPorCEP,
  cliente,
  setCliente,
  handleSelectUf,
  handleSelectCidade,
  id,
  addAlert
}) => {
  // Estado local
  const isEditing = editingField === field;
  const isNonEditable = ['id', 'data_criacao', 'data_atualizacao', 'criado_por', 'atualizado_por'].includes(field);
  const inputRef = useRef(null);
  const [newValue, setNewValue] = useState('');
  
  // Inicializa o valor do campo quando entra em modo de edição
  useEffect(() => {
    if (isEditing) {
      setNewValue(value || '');
      // Focus e seleção do conteúdo quando o campo entra em modo de edição
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isEditing, value]);
  
  // Manipulação do input
  const handleChange = (e) => {
    setNewValue(e.target.value);
  };
  
  // Inicia modo de edição
  const handleStartEdit = () => {
    startEdit(field, value);
  };
  
  // Salva as alterações
  const handleSave = async () => {
    if (!id) {
      console.error('ID não fornecido para o componente EditableField');
      cancelEdit();
      return;
    }

    try {
      // Não faz nada se o valor não mudou ou o campo estiver vazio
      if (newValue === value || newValue === '') {
        cancelEdit();
        return;
      }
      
      // Debug logs
      console.log(`Salvando campo: ${field}`);
      console.log(`Valor anterior: ${value}`);
      console.log(`Novo valor: ${newValue}`);
      console.log(`ID do cliente: ${id}`);
      
      // Cria o payload para a API
      const payload = { [field]: newValue };
      
      // Faz a requisição PATCH
      const response = await api.patch(`/cliente/clientes/${id}/`, payload);
      
      if (response.status >= 200 && response.status < 300) {
        // Atualiza o cliente no estado
        if (setCliente) {
          setCliente(prevState => ({
            ...prevState,
            [field]: newValue
          }));
        }
        
        // Mostra mensagem de sucesso
        if (typeof addAlert === 'function') {
          addAlert(`Campo ${field} atualizado com sucesso!`, 'success');
        } else {
          console.log(`Campo ${field} atualizado com sucesso!`);
        }
      } else {
        throw new Error(`Erro ao atualizar: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      
      if (typeof addAlert === 'function') {
        addAlert(`Erro ao atualizar o campo ${field}`, 'error');
      }
    } finally {
      // Sempre sai do modo de edição
      cancelEdit();
    }
  };
  
  // Manipulação de teclas (Enter e Escape)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Busca CEP
  const handleBuscarCep = async () => {
    if (!id) {
      console.error('ID não fornecido para o componente EditableField');
      return;
    }
    
    try {
      if (!newValue) return;
      
      const cepValue = newValue.replace(/\D/g, '');
      const endereco = await buscarEnderecoPorCEP(cepValue);
      
      if (!endereco) {
        if (typeof addAlert === 'function') {
          addAlert('CEP não encontrado.', 'error');
        }
        return;
      }
      
      const payload = {
        cep: cepValue,
        endereco: endereco.logradouro,
        cidade_id: endereco.municipio.id,
        estado_id: endereco.municipio.estado.id
      };
      
      console.log('Enviando payload para atualizar endereço:', payload);
      
      const response = await api.patch(`/cliente/clientes/${id}/`, payload);
      
      if (response.status >= 200 && response.status < 300) {
        // Atualiza o cliente
        if (setCliente) {
          setCliente(prevState => ({
            ...prevState,
            ...payload,
            cidade_nome: endereco.municipio.nome,
            estado_sigla: endereco.municipio.estado.sigla
          }));
        }
        
        // Atualiza os seletores
        if (handleSelectUf) {
          handleSelectUf({
            id: endereco.municipio.estado.id,
            sigla: endereco.municipio.estado.sigla
          });
        }
        
        if (handleSelectCidade) {
          handleSelectCidade({
            id: endereco.municipio.id,
            nome: endereco.municipio.nome,
            estado_id: endereco.municipio.estado.id
          });
        }
        
        setNewValue(cepValue);
        
        if (typeof addAlert === 'function') {
          addAlert('Endereço atualizado com sucesso!', 'success');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar ou atualizar endereço:', error);
      if (typeof addAlert === 'function') {
        addAlert('Erro ao buscar endereço pelo CEP.', 'error');
      }
    } finally {
      cancelEdit();
    }
  };

  return (
    <div className={`info-item ${fullWidth ? 'full-width' : ''}`}>
      <label>{label}:</label>
      {isEditing ? (
        <div className="edit-container" ref={editRef}>
          <input
            ref={inputRef}
            type="text"
            value={newValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="edit-input"
          />
          <div className="edit-buttons">
            {isCepField && (
              <button 
                className="search-btn" 
                onClick={handleBuscarCep} 
                title="Buscar endereço"
                type="button"
              >
                <FaSearch />
              </button>
            )}
            <button 
              className="save-btn" 
              onClick={handleSave} 
              title="Salvar"
              type="button"
            >
              <FaSave />
            </button>
            <button 
              className="cancel-btn" 
              onClick={cancelEdit} 
              title="Cancelar"
              type="button"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className="value-container">
          <span>{value || ''}</span>
          {!isNonEditable && (
            <button 
              className="edit-btn"
              onClick={handleStartEdit}
              title={`Editar ${label}`}
              type="button"
            >
              <FaEdit />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableField;