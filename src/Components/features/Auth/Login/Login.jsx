import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from "../../../../contexts/auth/AuthContext";
import { useAlert } from "../../../../contexts/alert/AlertContext";
import { Container, Stack } from "../../../ui/Layout";
import Card from "../../../ui/Card/Card";
import { ButtonPrimary } from "../../../ui/Button";
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addAlert } = useAlert();
    
    // Função para traduzir mensagens de erro comuns
    const traduzirErro = (mensagem) => {
        const traducoes = {
            'No active account found with the given credentials': 'Usuário ou senha incorretos',
            'Unable to log in with provided credentials': 'Não foi possível fazer login com as credenciais fornecidas',
            'User account is disabled': 'Conta de usuário desativada',
            'This field may not be blank': 'Este campo não pode estar vazio',
            'Authentication credentials were not provided': 'Credenciais de autenticação não fornecidas'
        };
        
        return traducoes[mensagem] || mensagem;
    };
    
    // Função para manipular mudanças nos inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { username, password } = formData;
        
        // Validação
        if (!username || !password) {
            addAlert('Preencha todos os campos', 'error', 5000);
            return;
        }
        
        // Prevenir envios múltiplos
        if (isProcessing) return;
        setIsProcessing(true);
        
        try {
            const result = await login(username, password);
            
            if (result.success) {
                addAlert('Login realizado com sucesso!', 'success', 3000);
                
                // Redirecionar após login bem-sucedido
                setTimeout(() => {
                    navigate('/usuarios');
                }, 1500);
            } else {
                // Traduzir a mensagem de erro
                const mensagemTraduzida = traduzirErro(result.message);
                
                // Manter username e limpar apenas a senha
                setFormData(prev => ({
                    ...prev,
                    password: ''
                }));
                
                addAlert(mensagemTraduzida || 'Credenciais inválidas', 'error', 15000);
            }
        } catch (error) {
            console.error('Erro durante login:', error);
            
            // Manter username e limpar apenas a senha
            setFormData(prev => ({
                ...prev,
                password: ''
            }));
            
            addAlert('Erro de comunicação com o servidor', 'error', 15000);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Container maxWidth="small" className="auth-container" fullHeight>
            <Card padding="large">
                <form onSubmit={handleSubmit} noValidate>
                    <Stack direction="column" spacing="lg">
                        <h1>Acesse o sistema</h1>
                        
                        <div className="input-field">
                            <input 
                                type="text" 
                                name="username"
                                placeholder="Usuario" 
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                                required
                            />
                            <FaUser className="icon" />
                        </div>
                        
                        <div className="input-field">
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Senha" 
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                            <FaLock className="icon" />
                        </div>
                        
                        <ButtonPrimary 
                            type="submit" 
                            className="login-button"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Entrando...' : 'Entrar'}
                        </ButtonPrimary>
                    </Stack>
                </form>
            </Card>
        </Container>
    );
};

export default Login;