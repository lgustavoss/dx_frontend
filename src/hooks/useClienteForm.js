import { useState, useCallback, useRef, useEffect } from 'react';
import { useAlert } from '../contexts/alert/AlertContext';
import { useCliente } from '../contexts/cliente/ClienteContext';
import { useLocationSelectors } from './useLocationSelectors';
import { cepService } from '../services/cepService';

export function useClienteForm(clienteId = null) {
  const [cliente, setCliente] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [pendingUfSelection, setPendingUfSelection] = useState(null);
  const [pendingCidadeSelection, setPendingCidadeSelection] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const clienteCarregado = useRef(false);
  const { addAlert } = useAlert();
  const locationSelectors = useLocationSelectors();
  const { fetchClienteById, updateCliente, loading } = useCliente();
  
  const fetchInitialUFs = useCallback(async () => {
    await locationSelectors.fetchUFs();
  }, [locationSelectors]);

  useEffect(() => {
    fetchInitialUFs();
  }, [fetchInitialUFs]);

  const loadCliente = useCallback(async () => {
    if (!clienteId || clienteCarregado.current) {
      return cliente;
    }
    try {
      const clienteData = await fetchClienteById(clienteId);
      
      if (clienteData) {
        setCliente(clienteData);
        clienteCarregado.current = true;
        
        // Configurar dados de localização
        if (clienteData.estado_sigla) {
          locationSelectors.setSelectedUf(clienteData.estado_sigla);
          locationSelectors.setSearchUf(clienteData.estado_sigla);
          locationSelectors.setSearchUfInternal(clienteData.estado_sigla);
          locationSelectors.setOriginalUf(clienteData.estado_sigla);
          
          // Carregar cidades
          await locationSelectors.fetchCidades(clienteData.estado_sigla);
          
          if (clienteData.cidade_nome) {
            locationSelectors.setSearchCidade(clienteData.cidade_nome);
            locationSelectors.setSearchCidadeInternal(clienteData.cidade_nome);
            locationSelectors.setOriginalCidade(clienteData.cidade_nome);
          }
        }
        
        return clienteData;
      }
    } catch (err) {
      addAlert('Erro ao buscar detalhes do cliente.', 'error');
      return null;
    }
  }, [clienteId, fetchClienteById, locationSelectors, addAlert, cliente]);

  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const endereco = await cepService.buscarEnderecoPorCEP(cep);
      return endereco;
    } catch (err) {
      addAlert(err.message || 'Erro ao buscar endereço pelo CEP.', 'error');
      return null;
    }
  };

  const handleSelectUfTemp = (uf) => {
    setPendingUfSelection(uf);
    locationSelectors.setSelectedUf(uf.sigla);
    locationSelectors.setSearchUf(uf.sigla);
    locationSelectors.setSearchUfInternal(uf.sigla);
    locationSelectors.fetchCidades(uf.sigla);
  };

  const handleSelectCidadeAndConfirm = (cidade) => {
    setPendingCidadeSelection(cidade);
    setShowConfirmationModal(true);
  };

  const confirmLocationChange = useCallback(async () => {
    if (!pendingUfSelection || !pendingCidadeSelection) return;
    
    try {
      const payload = {
        estado_sigla: pendingUfSelection.sigla,
        cidade_nome: pendingCidadeSelection.nome
      };
      
      const updatedData = await updateCliente(clienteId, payload);
      
      if (updatedData) {
        setCliente(prevCliente => ({
          ...prevCliente,
          ...payload
        }));
        
        if (pendingUfSelection.sigla !== cliente.estado_sigla) {
          addAlert(`Estado e cidade atualizados com sucesso!`, 'success');
        } else {
          addAlert(`Cidade atualizada com sucesso!`, 'success');
        }
      }
    } catch (err) {
      addAlert('Erro ao atualizar cidade e estado.', 'error');
    } finally {
      setShowConfirmationModal(false);
    }
  }, [pendingCidadeSelection, pendingUfSelection, clienteId, cliente, updateCliente, addAlert]);

  const cancelLocationChange = useCallback(() => {
    if (cliente) {
      locationSelectors.setSelectedUf(cliente.estado_sigla || '');
      locationSelectors.setSearchUf(cliente.estado_sigla || '');
      locationSelectors.setSearchUfInternal(cliente.estado_sigla || '');
      locationSelectors.setOriginalUf(cliente.estado_sigla || '');
      locationSelectors.setSearchCidade(cliente.cidade_nome || '');
      locationSelectors.setSearchCidadeInternal(cliente.cidade_nome || '');
      locationSelectors.setOriginalCidade(cliente.cidade_nome || '');
    }
    setPendingUfSelection(null);
    setPendingCidadeSelection(null);
    locationSelectors.setShowCidadeDropdown(false);
    addAlert('Alteração de cidade/estado cancelada.', 'info');
    setShowConfirmationModal(false);
  }, [cliente, locationSelectors, addAlert]);
  
  return {
    cliente,
    setCliente,
    loading,
    editingField,
    setEditingField,
    editValue,
    setEditValue,
    loadCliente,
    buscarEnderecoPorCEP,
    pendingUfSelection,
    pendingCidadeSelection,
    showConfirmationModal,
    confirmLocationChange,
    cancelLocationChange,
    handleSelectUf: handleSelectUfTemp,
    handleSelectCidade: handleSelectCidadeAndConfirm,
    ...locationSelectors
  };
}