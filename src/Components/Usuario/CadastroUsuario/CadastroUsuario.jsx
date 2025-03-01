import { useState, useContext } from 'react';
import { api } from '../../../axiosConfig';
import './CadastroUsuario.css';
import { SidebarContext } from '../../Sidebar/SidebarContext';

const CadastroUsuario = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        is_active: true,
        is_staff: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isSidebarOpen } = useContext(SidebarContext);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuario/users/', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Usuário cadastrado com sucesso!');
            setError('');
        } catch (err) {
            setError('Erro ao cadastrar usuário. Tente novamente.');
            setSuccess('');
        }
    };

    return (
        <div className={`container-cadastro ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <h1>Cadastro de Usuário</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Nome:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Senha:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group switch-group">
                    <label>Ativo:</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleSwitchChange}
                        />
                        <span className="slider"></span>
                    </label>
                    <label>Administrador:</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            name="is_staff"
                            checked={formData.is_staff}
                            onChange={handleSwitchChange}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <button type="submit" className="button-cadastrar">Cadastrar</button>
            </form>
            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}
        </div>
    );
};

export default CadastroUsuario;