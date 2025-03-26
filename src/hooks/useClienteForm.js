import { useState, useCallback, useRef, useEffect } from 'react';
import { useAlert } from '../Components/Alert/AlertContext';
import { useLocationSelectors } from './useLocationSelectors';
import { cepService } from '../services/cepService';
import { api } from '../axiosConfig';

export function useClienteForm(clienteId = null) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [pendingUfSelection, setPendingUfSelection] = useState(null);
  const [pendingCidadeSelection, setPendingCidadeSelection] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const clienteCarregado = useRef(false);
  const { addAlert } = useAlert();
  const locationSelectors = useLocationSelectors();

  const fetchInitialUFs = useCallback(async () => {
    await locationSelectors.fetchUFs();
  }, [locationSelectors]);

  useEffect(() => {
    fetchInitialUFs();
  }, [fetchInitialUFs]);

  const loadCliente = useCallback(async () => {
    if (!clienteId || clienteCarregado.current) {
      setLoading(false);
      return cliente;
    }
    try {
      setLoading(true);
      const response = await api.get(`/cliente/clientes/${clienteId}/`);
      const clienteData = response.data;
      setCliente(clienteData);
      clienteCarregado.current = true;
      setLoading(false);
      return clienteData;
    } catch (err) {
      console.error('Erro ao buscar detalhes do cliente:', err);
      addAlert('Erro ao buscar detalhes do cliente.', 'error');
      setLoading(false);
      return null;
    }
  }, [clienteId, locationSelectors, addAlert, cliente]);

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
      const response = await api.patch(`/cliente/clientes/${clienteId}/`, payload);
      if (response.status >= 200 && response.status < 300) {
        setCliente(prevCliente => ({
          ...prevCliente,
          ...payload
        }));
        if (pendingUfSelection.sigla !== cliente.estado_sigla) {
          addAlert(`Estado e cidade atualizados com sucesso!`, 'success');
        } else {
          addAlert(`Cidade atualizada com sucesso!`, 'success');
        }
      } else {
        throw new Error(`Erro na resposta: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao atualizar cidade/estado:', err);
      addAlert('Erro ao atualizar cidade e estado.', 'error');
    } finally {
      setShowConfirmationModal(false);
    }
  }, [pendingCidadeSelection, pendingUfSelection, clienteId, cliente, locationSelectors, addAlert]);

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