import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Box } from '../../../ui/Layout';
import Card from '../../../ui/Card/Card';
import { ButtonSecondary } from '../../../ui/Button';
import { useUsuario } from '../../../../contexts/usuario/UsuarioContext';
import './DetalheUsuario.css';

const DetalheUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuarioAtual, loading, fetchUsuarioById } = useUsuario();

    // Carregar dados do usuário quando o componente montar
    useEffect(() => {
        fetchUsuarioById(id);
    }, [id, fetchUsuarioById]);

    if (loading) {
        return (
            <Container maxWidth="large" className="container--glass">
                <Box padding="lg" textAlign="center">
                    <h1>Carregando detalhes do usuário...</h1>
                </Box>
            </Container>
        );
    }

    if (!usuarioAtual) {
        return (
            <Container maxWidth="large" className="container--glass">
                <Box padding="lg" textAlign="center">
                    <h1>Usuário não encontrado</h1>
                    <ButtonSecondary 
                        onClick={() => navigate('/usuarios')} 
                        leftIcon={<FaArrowLeft />}
                    >
                        Voltar para lista de usuários
                    </ButtonSecondary>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="large" className="container--glass">
            <h1>Detalhes do Usuário</h1>
            
            <Card variant="primary" padding="lg">
                <div className="user-details">
                    <div className="info-item">
                        <label>ID:</label>
                        <span>{usuarioAtual.id}</span>
                    </div>
                    <div className="info-item">
                        <label>Nome:</label>
                        <span>{usuarioAtual.first_name}</span>
                    </div>
                    <div className="info-item">
                        <label>Username:</label>
                        <span>{usuarioAtual.username}</span>
                    </div>
                    <div className="info-item">
                        <label>Email:</label>
                        <span>{usuarioAtual.email}</span>
                    </div>
                    <div className="info-item">
                        <label>Tipo:</label>
                        <span>{usuarioAtual.is_staff ? "Administrador" : "Usuário Normal"}</span>
                    </div>
                    <div className="info-item">
                        <label>Status:</label>
                        <span className={usuarioAtual.is_active ? "status-active" : "status-inactive"}>
                            {usuarioAtual.is_active ? "Ativo" : "Inativo"}
                        </span>
                    </div>
                </div>
            </Card>

            <Box display="flex" justifyContent="center" marginTop="lg">
                <ButtonSecondary 
                    onClick={() => navigate('/usuarios')}
                    leftIcon={<FaArrowLeft />}
                >
                    Voltar para lista de usuários
                </ButtonSecondary>
            </Box>
        </Container>
    );
};

export default DetalheUsuario;