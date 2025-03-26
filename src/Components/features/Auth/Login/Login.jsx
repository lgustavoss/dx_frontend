import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { api, addActivityListeners } from '../../../../axiosConfig';
import { useAlert } from '../../../Components/ui/Feedback/Alert/AlertContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { addAlert } = useAlert();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try { 
            const response = await api.post('/token/', {
                username: username,
                password: password
            });
            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            addActivityListeners(); // Adiciona os eventos de escuta de atividade do usuário

            // Obter dados do usuário logado
            const userResponse = await api.get('/me/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            localStorage.setItem('user', JSON.stringify(userResponse.data));

            // Adiciona a mensagem de sucesso
            addAlert('Login realizado com sucesso!', 'success');

            // Pequeno delay para o usuário ver a mensagem antes do redirecionamento
            setTimeout(() => {
                window.location = '/usuarios';
            }, 1000);
        } catch (err) {
            setError('Usuario ou senha inválidos');
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <>
            <Container maxWidth="small" className="auth-container">
                <Card padding="large">
                    <form onSubmit={handleSubmit}>
                        <Stack direction="column" spacing="lg">
                            <h1>Acesse o sistema</h1>
                            
                            <div className='input-field'>
                                <input type='text' placeholder='Usuario' onChange={(e) => setUsername(e.target.value)} />
                                <FaUser className='icon' />
                            </div>
                            
                            <div className='input-field'>
                                <input type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)} />
                                <FaLock className='icon' />
                            </div>
                            
                            {error && <Box className="error-message">{error}</Box>}
                            
                            <ButtonPrimary type='submit' fullWidth>
                                Entrar
                            </ButtonPrimary>
                        </Stack>
                    </form>
                </Card>
            </Container>
        </>
    )
}

export default Login;