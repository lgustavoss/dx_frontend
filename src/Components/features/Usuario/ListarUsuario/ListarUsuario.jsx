import { useEffect, useState, useContext } from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api, addActivityListeners } from '../../../axiosConfig';
import { SidebarContext } from '../../../Components/ui/Navigation';
import { Container, Box, Stack, Card } from '../../../Components/ui/Layout';
import { ButtonPrimary } from '../../../Components/ui/Button';
import { Alert } from '../../../Components/ui/Feedback';
import './ListarUsuario.css';

const ListarUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isSidebarOpen } = useContext(SidebarContext);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get('/usuario/users/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Response data:', response.data);
                
                // Use a propriedade results que contém o array de usuários
                setUsuarios(response.data.results);
                setLoading(false);
                
                addActivityListeners();
            } catch (err) {
                console.error('Error fetching users:', err.response ? err.response.data : err.message);
                setError('Erro ao buscar usuários. Tente novamente mais tarde.');
                setLoading(false);
                setTimeout(() => {
                    setError('');
                }, 5000);
            }
        };

        fetchUsuarios();
    }, []);

    const handleAddUser = () => {
        navigate('/cadastro');
    };

    return (
        <Container maxWidth="large" className={isSidebarOpen ? 'sidebar-open' : ''}>
            <Box padding="md" textAlign="center">
                <h1>Usuários Cadastrados</h1>
            </Box>

            <Card variant="primary" padding="md">
                {loading ? (
                    <Box padding="lg" textAlign="center">
                        <p>Carregando usuários...</p>
                    </Box>
                ) : (
                    <Stack spacing="lg" direction="column">
                        <Box className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Tipo</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(usuarios) && usuarios.length > 0 ? usuarios.map(usuario => (
                                        <tr key={usuario.id}>
                                            <td>{usuario.id}</td>
                                            <td>{usuario.first_name}</td>
                                            <td>{usuario.username}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.is_staff ? "Administrador" : "Usuário Normal"}</td>
                                            <td>
                                                <button className="button edit-button" title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6">Nenhum usuário encontrado</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Box>

                        <Box display="flex" justifyContent="center" marginTop="md">
                            <ButtonPrimary 
                                className="add-button" 
                                onClick={handleAddUser}
                                leftIcon={<FaPlus />}
                            >
                                Novo Usuário
                            </ButtonPrimary>
                        </Box>
                    </Stack>
                )}
            </Card>
            
            {error && <Alert type="error" message={error} />}
        </Container>
    );
}

export default ListarUsuario;