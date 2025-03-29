import React, { useEffect } from 'react';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../../../contexts/ui/UIContext';
import { useUsuario } from '../../../../contexts/usuario/UsuarioContext';
import { Container, Box, Stack } from '../../../ui/Layout';
import { ButtonPrimary } from '../../../ui/Button';
import './ListarUsuario.css';

const ListarUsuario = () => {
    const { usuarios, loading, fetchUsuarios } = useUsuario();
    const { isSidebarOpen } = useUI();
    const navigate = useNavigate();

    // Carregar usuários na montagem do componente
    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const handleAddUser = () => {
        navigate('/cadastro');
    };

    return (
        <Container maxWidth="large" className="container--glass">
            <h1>Usuários Cadastrados</h1>
            
            {loading ? (
                <Box padding="lg" textAlign="center">
                    <p>Carregando usuários...</p>
                </Box>
            ) : (
                <Stack spacing="xl" direction="column">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Ativo</th>
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
                                        <td className="actions-cell">
                                            <button 
                                                className="button view-button" 
                                                title="Visualizar"
                                                onClick={() => navigate(`/usuario/${usuario.id}`)}
                                            >
                                                <FaEye />
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
                    </div>

                    <Box className="add-button-container">
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
        </Container>
    );
};

export default ListarUsuario;