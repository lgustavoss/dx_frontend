import { useEffect, useState, useContext, useCallback } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarContext } from '../../Sidebar/SidebarContext';
import { useAlert } from '../../Alert/AlertContext';
import { api } from '../../../axiosConfig';

// Hooks personalizados
import { useClienteForm } from '../../../hooks/useClienteForm';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { useUserManagement } from '../../../hooks/useUserManagement';
import { useEditableField } from '../../../hooks/useEditableField';

// Componentes
import { 
  Loading, 
  NotFound,
  Endereco,
  InformacoesEmpresa,
  InformacoesAdicionais,
  Responsavel,
  ConfirmationModal // Importando o componente separado
} from './';

/**
 * Componente principal de exibição e edição dos detalhes de um cliente
 * 
 * @returns {JSX.Element} Componente DetalheCliente
 */
const DetalheCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSidebarOpen } = useContext(SidebarContext);
  const { addAlert } = useAlert();
  
  // Estado local para controle do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [pendingCity, setPendingCity] = useState(null);
  const [pendingState, setPendingState] = useState(null);
  
  // Estado para controle de inicialização
  const [initialized, setInitialized] = useState(false);
  
  // Estado para controle de usuários
  const { usuarios, fetchUsuarios, getUserName } = useUserManagement();
  
  // Hook personalizado para campos editáveis
  const {
    editingField,
    setEditingField,
    editValue,
    setEditValue,
    startEdit,
    cancelEdit,
    saveEdit,
    editRef
  } = useEditableField(id, 'cliente/clientes', (payload) => {
    // Callback para atualizar o estado local do cliente quando um campo for editado
    setCliente(prevCliente => ({
      ...prevCliente,
      ...payload
    }));
  });
  
  // Hook personalizado para gerenciar o formulário do cliente
  const {
    cliente,
    setCliente,
    loading,
    loadCliente,
    buscarEnderecoPorCEP,
    ufs,
    cidades,
    selectedUf,
    searchUf,
    searchCidade,
    searchUfInternal,
    searchCidadeInternal,
    setSearchUfInternal,
    setSearchCidadeInternal,
    setSearchUf,  
    setSearchCidade,  
    originalUf,
    originalCidade,
    setOriginalUf,
    setOriginalCidade,
    showUfDropdown,
    showCidadeDropdown,
    setShowUfDropdown,
    setShowCidadeDropdown,
    ufRef,
    cidadeRef,
    searchUfRef,
    searchCidadeRef,
    fetchUFs,
    fetchCidades
  } = useClienteForm(id);
  
  // Função para carregar usuários relacionados ao cliente
  const loadRelatedUsers = useCallback(async (clienteData) => {
    if (!clienteData) return;
    
    const userIds = [
      clienteData.criado_por,
      clienteData.atualizado_por
    ].filter(id => id);
    
    if (userIds.length > 0) {
      await fetchUsuarios(userIds);
    }
  }, [fetchUsuarios]);
  
  // Carregar dados do cliente - apenas uma vez na montagem do componente
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      if (initialized) return; // Evita inicializações repetidas
      
      try {
        // Primeiro carrega o cliente
        const clienteData = await loadCliente();
        
        // Depois carrega os usuários, se o componente ainda estiver montado
        if (clienteData && isMounted) {
          // Pequeno delay antes de buscar usuários
          setTimeout(() => {
            if (isMounted) {
              loadRelatedUsers(clienteData);
            }
          }, 1000);
        }
        
        // Marca como inicializado para evitar chamadas repetidas
        if (isMounted) {
          setInitialized(true);
        }
      } catch (error) {
        console.error("Erro ao inicializar dados:", error);
        if (isMounted) {
          addAlert("Erro ao carregar dados do cliente", "error");
        }
      }
    };
    
    if (!initialized) {
      initializeData();
    }
    
    // Cleanup function para evitar memory leaks
    return () => {
      isMounted = false;
    };
  }, [id, loadCliente, loadRelatedUsers, initialized, addAlert]);
  
  // Detectar cliques fora do campo de edição
  useOutsideClick(editRef, () => {
    if (editingField) {
      cancelEdit();
    }
  });

  // Função para lidar com seleção de UF
  const handleSelectUf = useCallback((uf) => {
    console.log("UF selecionada:", uf);
    setPendingState(uf);
    setOriginalUf(uf.sigla);
    setSearchUf(uf.sigla);
    setSearchUfInternal(uf.sigla);
    setShowUfDropdown(false);
    
    // Limpa a cidade quando a UF é alterada
    setSearchCidade('');
    setSearchCidadeInternal('');
    setOriginalCidade('');
    
    // Busca as cidades para a nova UF
    fetchCidades(uf.sigla);
    
    // Mostra dropdown de cidade
    setShowCidadeDropdown(true);
    
    addAlert(`Estado alterado para ${uf.sigla}. Por favor, selecione uma cidade para salvar.`, 'warning');
  }, [addAlert, fetchCidades, setOriginalCidade, setOriginalUf, setSearchCidade, setSearchCidadeInternal, setSearchUf, setSearchUfInternal, setShowCidadeDropdown, setShowUfDropdown]);

  // Função para lidar com seleção de cidade
  const handleSelectCidade = useCallback((cidade) => {
    console.log("Cidade selecionada:", cidade);
    setPendingCity(cidade);
    
    // Define a mensagem do modal com base na UF pendente
    if (pendingState) {
      setModalMessage(`Deseja alterar o estado para ${pendingState.sigla} e a cidade para ${cidade.nome}?`);
    } else {
      setModalMessage(`Deseja alterar a cidade para ${cidade.nome}?`);
    }
    
    // Mostra o modal
    setModalVisible(true);
  }, [pendingState]);

  // Função para confirmar alteração de UF/cidade
  const confirmLocationChange = useCallback(async () => {
    if (!cliente || !pendingCity) return;
    
    try {
      // Prepara o payload
      const payload = {
        cidade_id: pendingCity.id,
        estado_id: pendingState ? pendingState.id : cliente.estado_id
      };
      
      console.log("Payload para atualização:", payload);
      
      // Faz a requisição para o backend
      const response = await api.patch(`/cliente/clientes/${cliente.id}/`, payload);
      
      if (response.status >= 200 && response.status < 300) {
        // Atualiza o cliente localmente
        setCliente(prevCliente => ({
          ...prevCliente,
          ...payload,
          cidade_nome: pendingCity.nome,
          estado_sigla: pendingState ? pendingState.sigla : prevCliente.estado_sigla
        }));
        
        // Atualiza o estado da UI
        setSearchCidade(pendingCity.nome);
        setSearchCidadeInternal(pendingCity.nome);
        setOriginalCidade(pendingCity.nome);
        
        // Fecha o dropdown
        setShowCidadeDropdown(false);
        
        // Mostra mensagem de sucesso
        if (pendingState) {
          addAlert('Estado e cidade atualizados com sucesso!', 'success');
        } else {
          addAlert('Cidade atualizada com sucesso!', 'success');
        }
      } else {
        throw new Error(`Erro na resposta: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar localização:", error);
      addAlert('Erro ao atualizar localização. Tente novamente.', 'error');
    } finally {
      // Limpa os estados pendentes
      setPendingCity(null);
      setPendingState(null);
      setModalVisible(false);
    }
  }, [addAlert, cliente, pendingCity, pendingState, setCliente, setOriginalCidade, setSearchCidade, setSearchCidadeInternal, setShowCidadeDropdown]);

  // Função para cancelar alteração de UF/cidade
  const cancelLocationChange = useCallback(() => {
    // Restaura os valores originais
    if (cliente) {
      setSearchUf(cliente.estado_sigla || '');
      setSearchUfInternal(cliente.estado_sigla || '');
      setOriginalUf(cliente.estado_sigla || '');
      
      setSearchCidade(cliente.cidade_nome || '');
      setSearchCidadeInternal(cliente.cidade_nome || '');
      setOriginalCidade(cliente.cidade_nome || '');
    }
    
    // Fecha os dropdowns
    setShowUfDropdown(false);
    setShowCidadeDropdown(false);
    
    // Limpa os estados pendentes
    setPendingCity(null);
    setPendingState(null);
    
    // Fecha o modal
    setModalVisible(false);
    
    addAlert('Alteração de localização cancelada.', 'info');
  }, [addAlert, cliente, setOriginalCidade, setOriginalUf, setSearchCidade, setSearchCidadeInternal, setSearchUf, setSearchUfInternal, setShowCidadeDropdown, setShowUfDropdown]);

  // Renderização condicional
  if (loading) {
    return <Loading isSidebarOpen={isSidebarOpen} />;
  }

  if (!cliente) {
    return <NotFound isSidebarOpen={isSidebarOpen} navigate={navigate} />;
  }

  return (
    <div className={`container-base container-detalhe-cliente ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <h1>Detalhes do Cliente</h1>
      
      <InformacoesEmpresa 
        cliente={cliente}
        editingField={editingField}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        editRef={editRef}
        setEditValue={setEditValue}
        id={cliente.id}
        setCliente={setCliente}
        addAlert={addAlert}
      />
      
      <Endereco 
        cliente={cliente}
        setCliente={setCliente}
        editingField={editingField}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        editRef={editRef}
        setEditValue={setEditValue}
        buscarEnderecoPorCEP={buscarEnderecoPorCEP}
        handleSelectUf={handleSelectUf}
        handleSelectCidade={handleSelectCidade}
        ufs={ufs}
        cidades={cidades}
        selectedUf={selectedUf}
        searchUf={searchUf}
        searchCidade={searchCidade}
        setSearchUfInternal={setSearchUfInternal}
        setSearchCidadeInternal={setSearchCidadeInternal}
        originalUf={originalUf}
        originalCidade={originalCidade}
        setOriginalUf={setOriginalUf}
        setOriginalCidade={setOriginalCidade}
        showUfDropdown={showUfDropdown}
        showCidadeDropdown={showCidadeDropdown}
        setShowUfDropdown={setShowUfDropdown}
        setShowCidadeDropdown={setShowCidadeDropdown}
        ufRef={ufRef}
        cidadeRef={cidadeRef}
        searchUfRef={searchUfRef}
        searchCidadeRef={searchCidadeRef}
        fetchUFs={fetchUFs}
        addAlert={addAlert}
        id={cliente.id}
      />
      
      <Responsavel 
        cliente={cliente}
        editingField={editingField}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        editRef={editRef}
        setEditValue={setEditValue}
        id={cliente.id}
        setCliente={setCliente}
        addAlert={addAlert}
      />
      
      <InformacoesAdicionais 
        cliente={cliente}
        getUserName={getUserName}
      />

      <div className="button-container">
        <button 
          className="button-voltar" 
          onClick={() => navigate('/clientes')}
          type="button"
        >
          <FaArrowLeft /> Voltar para Listagem
        </button>
      </div>
      
      {pendingState && !pendingCity && (
        <div className="warning-message">
          Você alterou a UF para {pendingState.sigla}. Por favor, selecione uma cidade para salvar as alterações.
        </div>
      )}

      {/* Usando o componente separado ConfirmationModal */}
      <ConfirmationModal
        show={modalVisible}
        title="Confirmar Alteração de Localização"
        message={modalMessage}
        onConfirm={confirmLocationChange}
        onCancel={cancelLocationChange}
      />
    </div>
  );
};

export default DetalheCliente;