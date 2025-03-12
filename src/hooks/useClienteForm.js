import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../axiosConfig';
import { useAlert } from '../Components/Alert/AlertContext';
import { useLocationSelectors } from './useLocationSelectors';
import { cepService } from '../services/cepService';

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
  
  // Carregar UFs com useCallback para memoização
  const fetchInitialUFs = useCallback(async () => {
    await locationSelectors.fetchUFs();
  }, [locationSelectors]);
  
  // Efeito para carregar UFs apenas uma vez no início
  useEffect(() => {
    fetchInitialUFs();
  }, [fetchInitialUFs]);
  
  // Carregar cliente com useCallback para evitar múltiplas chamadas
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
      
      // Configurar UF e cidade - com setTimeout para evitar sobrecarga
      if (clienteData.estado_sigla) {
        const estadoSigla = clienteData.estado_sigla;
        locationSelectors.setSelectedUf(estadoSigla);
        locationSelectors.setSearchUf(estadoSigla);
        locationSelectors.setSearchUfInternal(estadoSigla);
        locationSelectors.setOriginalUf(estadoSigla);
        
        // Atrasa a chamada para buscar cidades
        setTimeout(async () => {
          try {
            await locationSelectors.fetchCidades(estadoSigla);
            
            if (clienteData.cidade_nome) {
              const cidadeNome = clienteData.cidade_nome;
              locationSelectors.setSearchCidade(cidadeNome);
              locationSelectors.setSearchCidadeInternal(cidadeNome);
              locationSelectors.setOriginalCidade(cidadeNome);
            }
          } catch (err) {
            console.error('Erro ao buscar cidades:', err);
          }
        }, 500);
      }
      
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

  // Buscar endereço por CEP
  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const endereco = await cepService.buscarEnderecoPorCEP(cep);
      return endereco;
    } catch (err) {
      addAlert(err.message || 'Erro ao buscar endereço pelo CEP.', 'error');
      return null;
    }
  };

  // Função para selecionar UF sem salvar no servidor
  const handleSelectUfTemp = (uf) => {
    console.log("UF selecionada:", uf);
    
    // Sempre armazenar a UF selecionada como pendente
    setPendingUfSelection(uf);
    
    // Atualizar UI
    locationSelectors.setSelectedUf(uf.sigla);
    locationSelectors.setSearchUf(uf.sigla);
    locationSelectors.setSearchUfInternal(uf.sigla);
    locationSelectors.setOriginalUf(uf.sigla);
    
    // Limpar cidade
    locationSelectors.setSearchCidade('');
    locationSelectors.setSearchCidadeInternal('');
    locationSelectors.setOriginalCidade('');
    locationSelectors.setShowCidadeDropdown(true);
    
    // Buscar cidades para a nova UF
    locationSelectors.fetchCidades(uf.sigla);
    
    // Alerta para o usuário
    addAlert(`Estado alterado para ${uf.sigla}. Por favor, selecione uma cidade para salvar a alteração.`, 'warning');
    
    return uf;
  };

  // Função para confirmar a seleção de cidade e estado
  const confirmLocationChange = useCallback(async () => {
    console.log("Executando confirmLocationChange");
    console.log("pendingCidadeSelection:", pendingCidadeSelection);
    console.log("pendingUfSelection:", pendingUfSelection);
    
    if (!pendingCidadeSelection) {
      console.error("Nenhuma cidade selecionada para confirmar");
      return;
    }
    
    // Determinar o ID correto do estado
    const estadoId = pendingUfSelection?.id || cliente?.estado_id;
    
    if (!estadoId) {
      console.error("ID do estado não encontrado");
      addAlert('Erro: Estado não selecionado corretamente.', 'error');
      setShowConfirmationModal(false);
      return;
    }

    try {
      // Preparar payload com UF e cidade
      const payload = {
        cidade_id: pendingCidadeSelection.id,
        estado_id: estadoId
      };
      
      console.log("Atualizando localização:", payload);
      console.log("UF pendente:", pendingUfSelection);
      console.log("Cidade pendente:", pendingCidadeSelection);
      
      // Chamar API para atualizar
      const response = await api.patch(`/cliente/clientes/${clienteId}/`, payload);
      
      if (response.status >= 200 && response.status < 300) {
        // Atualizar dados do cliente localmente
        setCliente(prevCliente => {
          const updatedCliente = {
            ...prevCliente,
            ...payload,
            cidade_nome: pendingCidadeSelection.nome,
            estado_sigla: pendingUfSelection ? pendingUfSelection.sigla : prevCliente.estado_sigla
          };
          console.log("Cliente atualizado:", updatedCliente);
          return updatedCliente;
        });
        
        // Atualizar campos de cidade usando o seletor de localização
        locationSelectors.setSearchCidade(pendingCidadeSelection.nome);
        locationSelectors.setSearchCidadeInternal(pendingCidadeSelection.nome);
        locationSelectors.setOriginalCidade(pendingCidadeSelection.nome);
        locationSelectors.setShowCidadeDropdown(false);
        
        // Limpar a seleção de UF pendente
        setPendingUfSelection(null);
        setPendingCidadeSelection(null);
        
        // Mensagem de sucesso
        if (pendingUfSelection) {
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
      // Fechar o modal de confirmação
      setShowConfirmationModal(false);
    }
  }, [pendingCidadeSelection, pendingUfSelection, clienteId, cliente, locationSelectors, addAlert]);

  // Função para cancelar a alteração de localização
  const cancelLocationChange = useCallback(() => {
    console.log("Cancelando alteração de localização");
    
    // Restaurar valores originais
    if (cliente) {
      locationSelectors.setSelectedUf(cliente.estado_sigla || '');
      locationSelectors.setSearchUf(cliente.estado_sigla || '');
      locationSelectors.setSearchUfInternal(cliente.estado_sigla || '');
      locationSelectors.setOriginalUf(cliente.estado_sigla || '');
      
      locationSelectors.setSearchCidade(cliente.cidade_nome || '');
      locationSelectors.setSearchCidadeInternal(cliente.cidade_nome || '');
      locationSelectors.setOriginalCidade(cliente.cidade_nome || '');
    }
    
    // Limpar estados pendentes
    setPendingUfSelection(null);
    setPendingCidadeSelection(null);
    
    // Fechar dropdown de cidade
    locationSelectors.setShowCidadeDropdown(false);
    
    addAlert('Alteração de cidade/estado cancelada.', 'info');
    
    // Fechar o modal de confirmação
    setShowConfirmationModal(false);
  }, [cliente, locationSelectors, addAlert]);

  // Função para selecionar cidade e exibir modal de confirmação
  const handleSelectCidadeAndConfirm = useCallback((cidade) => {
    console.log("Cidade selecionada:", cidade);
    
    // Sempre armazenar a cidade selecionada temporariamente
    setPendingCidadeSelection(cidade);
    
    // Exibir modal de confirmação sempre
    console.log("Exibindo modal de confirmação");
    setShowConfirmationModal(true);
    
    return cidade;
  }, []);

  // Debug: monitorar alterações no estado do modal
  useEffect(() => {
    console.log("Estado do modal:", showConfirmationModal);
  }, [showConfirmationModal]);
  
  // Verificar se há seleção de UF pendente ao sair da página
  useEffect(() => {
    if (pendingUfSelection) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'Você alterou o Estado mas não selecionou uma Cidade. Suas alterações serão perdidas se sair sem confirmar.';
        return e.returnValue;
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [pendingUfSelection]);
  
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

export default useClienteForm;