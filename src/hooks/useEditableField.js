import { useState, useCallback, useRef, useEffect } from 'react';
import { useAlert } from '../Components/Alert/AlertContext';

/**
 * Hook aprimorado para gerenciar campos editáveis
 * 
 * @param {Object} options - Opções de configuração
 * @param {string} options.apiEndpoint - Endpoint base da API (ex: '/usuario/users/')
 * @param {string} options.entityId - ID da entidade sendo editada
 * @param {Function} options.onSuccessUpdate - Callback executado após atualização bem-sucedida
 * @param {Function} options.onErrorUpdate - Callback executado após erro na atualização
 * @param {Function} options.transformData - Função para transformar os dados antes de enviar à API
 * @param {Object} options.api - Instância axios customizada (opcional)
 * @returns {Object} - Funções e estados para gerenciar campos editáveis
 */
export function useEditableField({
  apiEndpoint,
  entityId,
  onSuccessUpdate,
  onErrorUpdate,
  transformData,
  api
}) {
  // Estado para controlar qual campo está sendo editado
  const [editingField, setEditingField] = useState(null);
  
  // Ref para o elemento que está sendo editado
  const editRef = useRef(null);
  
  // Acesso ao sistema de alertas
  const { addAlert } = useAlert();
  
  // Instância da API a ser usada
  const apiInstance = api || (typeof window !== 'undefined' ? window.api : null);

  /**
   * Inicia o modo de edição para um campo
   * @param {string} fieldName - Nome do campo a ser editado
   * @param {*} fieldValue - Valor atual do campo
   */
  const startEdit = useCallback((fieldName) => {
    // Verifica se o campo pode ser editado
    const nonEditableFields = ['id', 'data_criacao', 'data_atualizacao', 'criado_por', 'atualizado_por'];
    if (nonEditableFields.includes(fieldName)) {
      return;
    }
    setEditingField(fieldName);
  }, []);

  /**
   * Cancela a edição do campo atual
   */
  const cancelEdit = useCallback(() => {
    setEditingField(null);
  }, []);

  /**
   * Salva as alterações do campo atual
   * @param {string} fieldName - Nome do campo
   * @param {*} fieldValue - Novo valor do campo
   */
  const saveEdit = useCallback(async (fieldName, fieldValue) => {
    if (!fieldName || !entityId || !apiEndpoint || !apiInstance) {
      setEditingField(null);
      return;
    }

    try {
      // Prepara os dados para envio
      let payload = { [fieldName]: fieldValue };
      
      // Aplica transformação nos dados, se fornecida
      if (transformData) {
        payload = transformData(fieldName, fieldValue, payload);
      }

      // Envia requisição para a API
      const response = await apiInstance.patch(`${apiEndpoint}${entityId}/`, payload);
      
      // Processa resposta bem-sucedida
      if (response.status >= 200 && response.status < 300) {
        // Executa callback de sucesso
        if (onSuccessUpdate) {
          onSuccessUpdate(fieldName, fieldValue, response.data);
        }
        
        // Exibe alerta de sucesso
        addAlert(`Campo ${fieldName} atualizado com sucesso!`, 'success');
      } else {
        throw new Error(`Erro ao atualizar: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Erro ao atualizar ${fieldName}:`, err);
      
      // Exibe alerta de erro
      addAlert(`Erro ao atualizar campo. ${err.message || 'Tente novamente.'}`, 'error');
      
      // Executa callback de erro
      if (onErrorUpdate) {
        onErrorUpdate(fieldName, fieldValue, err);
      }
    } finally {
      // Limpa o campo em edição
      setEditingField(null);
    }
  }, [entityId, apiEndpoint, apiInstance, addAlert, onSuccessUpdate, onErrorUpdate, transformData]);

  /**
   * Detecta clique fora do componente para cancelar edição
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target) && editingField) {
        cancelEdit();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingField, cancelEdit]);

  /**
   * Detecta tecla ESC para cancelar edição
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && editingField) {
        cancelEdit();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingField, cancelEdit]);

  return {
    editingField,
    startEdit,
    cancelEdit,
    saveEdit,
    editRef
  };
}