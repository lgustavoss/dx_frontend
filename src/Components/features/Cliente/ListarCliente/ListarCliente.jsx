import { useEffect, useState, useContext } from 'react';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api, addActivityListeners } from '../../../axiosConfig';
import { SidebarContext } from '../../../Components/ui/Navigation';
import { useAlert } from '../../../Components/ui/Feedback/Alert/AlertContext';
import { Container, Box, Stack, Card } from '../../../Components/ui/Layout';
import { ButtonPrimary } from '../../../Components/ui/Button';
import { Alert } from '../../../Components/ui/Feedback';
import './ListarCliente.css';

const ListarCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isSidebarOpen } = useContext(SidebarContext);
    const navigate = useNavigate();
    const { addAlert } = useAlert();

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await api.get('/cliente/clientes/');
                console.log('Response data:', response.data);
                
                // Use a propriedade results que contém o array de clientes
                setClientes(response.data.results);
                setLoading(false);
                
                addActivityListeners();
            } catch (err) {
                console.error('Error fetching clientes:', err.response ? err.response.data : err.message);
                setError('Erro ao buscar clientes. Tente novamente mais tarde.');
                addAlert('Erro ao buscar clientes. Tente novamente mais tarde.', 'error');
                setLoading(false);
            }
        };

        fetchClientes();
    }, [addAlert]);

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
                {loading ? (
                    <Box padding="lg" textAlign="center">
                        <p>Carregando clientes...</p>
                    </Box>
                ) : (
                    <Stack spacing="lg" direction="column">
                        <Box className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>CNPJ</th>
                                        <th>Nome Fantasia</th>
                                        <th>Cidade/UF</th>
                                        <th>Detalhes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.length > 0 ? (
                                        clientes.map(cliente => (
                                            <tr key={cliente.id}>
                                                <td>{cliente.id}</td>
                                                <td>{cliente.cnpj}</td>
                                                <td>{cliente.nome_fantasia}</td>
                                                <td>{cliente.cidade_nome}/{cliente.estado_sigla}</td>
                                                <td className="actions-column">
                                                    <button 
                                                        className="button view-button" 
                                                        title="Visualizar"
                                                        onClick={() => handleView(cliente.id)}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">Nenhum cliente encontrado</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Box>

                        <Box display="flex" justifyContent="flex-end" marginTop="md">
                            <ButtonPrimary 
                                className="add-button" 
                                onClick={handleAddCliente}
                                leftIcon={<FaPlus />}
                            >
                                Novo Cliente
                            </ButtonPrimary>
                        </Box>
                    </Stack>
                )}
            </Card>
            
            {error && <Alert type="error" message={error} />}
        </Container>
    );
}

export default ListarCliente;