import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { api, addActivityListeners } from '../../axiosConfig';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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

            window.location = '/usuarios';
        } catch (err) {
            setError('Usuario ou senha inválidos');
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <>
            <div className='container-login'>
                <form onSubmit={handleSubmit}>
                    <h1>Acesse o sistema</h1>
                    <div className='input-field'>
                        <input 
                            type='text' 
                            placeholder='Usuario' 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className='input-field'>
                        <input 
                            type='password' 
                            placeholder='Senha' 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FaLock className='icon' />
                    </div>

                    <div className="recall-forget">
                        <label>
                            <input type="checkbox" />
                            Lembre de mim
                        </label>
                        <a href="#">Esqueci a senha</a>
                    </div>

                    <button className="login-button">Entrar</button>
                </form>
            </div>
            {error && <div className="alert">{error}</div>}
        </>
    )
}

export default Login;