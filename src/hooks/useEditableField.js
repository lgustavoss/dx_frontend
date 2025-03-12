import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../axiosConfig';
import { useAlert } from '../Components/Alert/AlertContext';

/**
 * Hook para gerenciar campos editáveis
 * @param {string} entityId - ID da entidade sendo editada (ex: ID do cliente)
 * @param {string} entityType - Tipo da entidade (ex: "cliente" para usar na URL da API)
 * @param {Function} updateCallback - Função para atualizar o estado local após edição bem-sucedida
 * @returns {Object} Funções e estados para gerenciar campos editáveis
 */
export function useEditableField(entityId, entityType, updateCallback) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editRef = useRef(null);
  const { addAlert } = useAlert();
  
  // Função para iniciar edição de um campo
  const startEdit = useCallback((field, value) => {
    const nonEditableFields = ['id', 'data_criacao', 'data_atualizacao', 'criado_por', 'atualizado_por'];
    if (nonEditableFields.includes(field)) {
      return;
    }
    
    setEditingField(field);
    setEditValue(value || '');
  }, []);

  // Função para cancelar a edição
  const cancelEdit = useCallback(() => {
    setEditingField(null);
    setEditValue('');
  }, []);

  // Função para salvar a edição
  const saveEdit = useCallback(async () => {
    if (!editingField || !entityId) {
      setEditingField(null);
      return;
    }
    
    // Verificar se o valor realmente foi alterado
    if (editValue === '') {
      setEditingField(null);
      return;
    }
    
    try {
      const payload = { [editingField]: editValue };
      
      // Fazer requisição à API
      const response = await api.patch(`/${entityType}/${entityId}/`, payload);
      
      if (response.status >= 200 && response.status < 300) {
        // Atualizar o estado local através do callback
        if (updateCallback) {
          updateCallback(payload);
        }
        
        addAlert(`Campo ${editingField} atualizado com sucesso!`, 'success');
      } else {
        throw new Error(`Erro ao atualizar: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Erro ao atualizar ${entityType}:`, err);
      addAlert(`Erro ao atualizar ${entityType}. Tente novamente.`, 'error');
    } finally {
      setEditingField(null);
    }
  }, [entityId, entityType, editingField, editValue, updateCallback, addAlert]);
  
  // Detectar tecla ESC para cancelar edição
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && editingField) {
        cancelEdit();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editingField, cancelEdit]);
  
  return {
    editingField,
    setEditingField,
    editValue,
    setEditValue,
    startEdit,
    cancelEdit,
    saveEdit,
    editRef
  };
}

export default useEditableField;