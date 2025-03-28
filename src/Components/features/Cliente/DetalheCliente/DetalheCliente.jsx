import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Box, Stack } from '../../../ui/Layout';
import Card from '../../../ui/Card/Card';
import { ButtonSecondary } from '../../../ui/Button';
import { Modal } from '../../../ui/Feedback';
import { useAlert } from '../../../../contexts/alert/AlertContext';
import { useCliente } from '../../../../contexts/cliente/ClienteContext';
import InformacoesEmpresa from './sections/InformacoesEmpresa';
import Endereco from './sections/Endereco';
import Responsavel from './sections/Responsavel';
import InformacoesAdicionais from './sections/InformacoesAdicionais';
import { useClienteForm } from "../../../../hooks/useClienteForm";
import './DetalheCliente.css';

const DetalheCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const { fetchUserList } = useAuth(); // Assumindo que temos esse método no AuthContext
    const { addAlert } = useAlert();

    // Usa o hook personalizado para gerenciar o formulário de cliente
    const {
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
        handleSelectUf,
        handleSelectCidade,
        ...locationSelectors
    } = useClienteForm(id);

    const editRef = useRef(null);
    const { updateCliente } = useCliente();

    // Carrega os dados do cliente e usuários quando o componente é montado
    useEffect(() => {
        const fetchData = async () => {
            await loadCliente();
            
            // Usando o método fetchUserList do AuthContext em vez de chamada direta à API
            const usersList = await fetchUserList();
            setUsers(usersList || []);
        };
        
        fetchData();
    }, [loadCliente, fetchUserList]);

    // Função para obter o nome do usuário a partir do ID
    const getUserName = useCallback((userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.username : 'Usuário Desconhecido';
    }, [users]);

    // Iniciar a edição de um campo
    const startEdit = (field, value) => {
        setEditingField(field);
        setEditValue(value);
    };

    // Cancelar a edição de um campo
    const cancelEdit = () => {
        setEditingField(null);
    };

    // Salvar a edição de um campo usando o contexto
    const saveEdit = async () => {
        try {
            if (!editingField || editValue === cliente[editingField]) {
                cancelEdit();
                return;
            }

            const payload = { [editingField]: editValue };
            
            const updatedCliente = await updateCliente(id, payload);
            
            if (updatedCliente) {
                setCliente({ ...cliente, ...payload });
                cancelEdit();
                addAlert(`Campo ${editingField} atualizado com sucesso!`, 'success');
            }
        } catch (err) {
            console.error('Erro ao atualizar campo:', err);
            addAlert('Erro ao atualizar campo. Tente novamente.', 'error');
        }
    };

    // Se estiver carregando, mostra uma mensagem de carregamento
    if (loading) {
        return (
            <Container maxWidth="large">
                <Box padding="lg" textAlign="center">
                    <h1>Carregando informações do cliente...</h1>
                </Box>
            </Container>
        );
    }

    // Se não encontrou o cliente, mostra uma mensagem de erro
    if (!cliente) {
        return (
            <Container maxWidth="large">
                <Box padding="lg" textAlign="center">
                    <h1>Cliente não encontrado</h1>
                    <ButtonSecondary onClick={() => navigate('/clientes')} leftIcon={<FaArrowLeft />}>
                        Voltar para lista de clientes
                    </ButtonSecondary>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="large">
            <Stack spacing="lg" direction="column">
                <Box textAlign="center">
                    <h1>Detalhes do Cliente</h1>
                </Box>
                
                <Card variant="primary" padding="md">
                    <InformacoesEmpresa
                        cliente={cliente}
                        editingField={editingField}
                        startEdit={startEdit}
                        cancelEdit={cancelEdit}
                        saveEdit={saveEdit}
                        editRef={editRef}
                        setEditValue={setEditValue}
                        setCliente={setCliente}
                        buscarEnderecoPorCEP={buscarEnderecoPorCEP}
                        id={id}
                        setSearchUf={locationSelectors.setSearchUf}
                        setSearchUfInternal={locationSelectors.setSearchUfInternal}
                        setOriginalUf={locationSelectors.setOriginalUf}
                        setSearchCidade={locationSelectors.setSearchCidade}
                        setSearchCidadeInternal={locationSelectors.setSearchCidadeInternal}
                        setOriginalCidade={locationSelectors.setOriginalCidade}
                    />
                </Card>
                
                <Card variant="primary" padding="md">
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
                        ufs={locationSelectors.ufs}
                        cidades={locationSelectors.cidades}
                        selectedUf={locationSelectors.selectedUf}
                        searchUf={locationSelectors.searchUf}
                        searchCidade={locationSelectors.searchCidade}
                        setSearchUfInternal={locationSelectors.setSearchUfInternal}
                        setSearchCidadeInternal={locationSelectors.setSearchCidadeInternal}
                        originalUf={locationSelectors.originalUf}
                        originalCidade={locationSelectors.originalCidade}
                        setOriginalUf={locationSelectors.setOriginalUf}
                        setOriginalCidade={locationSelectors.setOriginalCidade}
                        showUfDropdown={locationSelectors.showUfDropdown}
                        showCidadeDropdown={locationSelectors.showCidadeDropdown}
                        setShowUfDropdown={locationSelectors.setShowUfDropdown}
                        setShowCidadeDropdown={locationSelectors.setShowCidadeDropdown}
                        ufRef={locationSelectors.ufRef}
                        cidadeRef={locationSelectors.cidadeRef}
                        searchUfRef={locationSelectors.searchUfRef}
                        searchCidadeRef={locationSelectors.searchCidadeRef}
                        fetchUFs={locationSelectors.fetchUFs}
                        fetchCidades={locationSelectors.fetchCidades}
                        addAlert={locationSelectors.addAlert}
                        id={id}
                        setSearchUf={locationSelectors.setSearchUf}
                        setSearchCidade={locationSelectors.setSearchCidade}
                    />
                </Card>

                <Card variant="primary" padding="md">
                    <Responsavel
                        cliente={cliente}
                        editingField={editingField}
                        startEdit={startEdit}
                        cancelEdit={cancelEdit}
                        saveEdit={saveEdit}
                        editRef={editRef}
                        setEditValue={setEditValue}
                        setCliente={setCliente}
                        addAlert={locationSelectors.addAlert}
                        id={id}
                    />
                </Card>

                <Card variant="primary" padding="md">
                    <InformacoesAdicionais
                        cliente={cliente}
                        getUserName={getUserName}
                    />
                </Card>

                <Divider />

                <Box display="flex" justifyContent="center">
                    <ButtonSecondary 
                        onClick={() => navigate('/clientes')}
                        leftIcon={<FaArrowLeft />}
                    >
                        Voltar para lista de clientes
                    </ButtonSecondary>
                </Box>
            </Stack>

            {/* Modal de confirmação para alteração de cidade/estado */}
            {showConfirmationModal && (
                <Modal
                    isOpen={showConfirmationModal}
                    onClose={cancelLocationChange}
                    title="Confirmar alteração de localização"
                    confirmButtonText="Confirmar"
                    confirmButtonAction={confirmLocationChange}
                    cancelButtonText="Cancelar"
                    cancelButtonAction={cancelLocationChange}
                >
                    <p>
                        Deseja realmente alterar a localização do cliente para {pendingCidadeSelection?.nome} - {pendingUfSelection?.sigla}?
                    </p>
                </Modal>
            )}
        </Container>
    );
}

export default DetalheCliente;