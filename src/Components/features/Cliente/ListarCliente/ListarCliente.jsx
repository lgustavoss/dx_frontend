import { useEffect } from 'react';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../../../contexts/ui/UIContext';
import { useCliente } from '../../../../contexts/cliente/ClienteContext';
import { useAlert } from '../../../../contexts/alert/AlertContext';
import { Container, Box, Stack } from '../../../ui/Layout'; 
import Card from '../../../ui/Card/Card'; 
import { ButtonPrimary } from '../../../ui/Button';
import './ListarCliente.css';

const ListarCliente = () => {
    const { isSidebarOpen } = useUI();
    const navigate = useNavigate();
    const { clientes, loading, fetchClientes } = useCliente();
    const { addAlert } = useAlert();

    useEffect(() => {
        fetchClientes().catch(() => {
            addAlert('Erro ao buscar clientes. Tente novamente mais tarde.', 'error');
        });
    }, [fetchClientes, addAlert]);

    const handleAddCliente = () => {
        navigate('/cadastro-cliente');
    };

    const handleView = (id) => {
        navigate(`/cliente/${id}`);
    };

    return (
        <Container maxWidth="large" className={isSidebarOpen ? 'sidebar-open' : ''}>
            <Box padding="md" textAlign="center">
                <h1>Clientes Cadastrados</h1>
            </Box>

            <Card variant="primary" padding="md">
                <Box display="flex" justifyContent="flex-end" marginBottom="md">
                    <ButtonPrimary onClick={handleAddCliente} leftIcon={<FaPlus />}>
                        Adicionar Cliente
                    </ButtonPrimary>
                </Box>

                {loading ? (
                    <p className="loading-message">Carregando clientes...</p>
                ) : clientes.length === 0 ? (
                    <p className="empty-message">Nenhum cliente cadastrado</p>
                ) : (
                    <div className="client-list">
                        <div className="client-list-header">
                            <span>ID</span>
                            <span>CNPJ</span>
                            <span>Razão Social</span>
                            <span>Nome Fantasia</span>
                            <span>Estado</span>
                            <span>Ações</span>
                        </div>
                        {clientes.map((cliente) => (
                            <div key={cliente.id} className="client-list-item">
                                <span>{cliente.id}</span>
                                <span>{cliente.cnpj}</span>
                                <span className="razao-social">{cliente.razao_social}</span>
                                <span>{cliente.nome_fantasia}</span>
                                <span>{cliente.estado_sigla}</span>
                                <span className="actions">
                                    <button onClick={() => handleView(cliente.id)}>
                                        <FaEye />
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default ListarCliente;