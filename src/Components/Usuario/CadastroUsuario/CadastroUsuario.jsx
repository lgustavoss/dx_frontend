import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../axiosConfig';
import './CadastroUsuario.css';
import { SidebarContext } from '../../Sidebar/SidebarContext';
import { useAlert } from '../../Alert/AlertContext';

const CadastroUsuario = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        is_active: true,
        is_staff: false
    });
    const { isSidebarOpen } = useContext(SidebarContext);
    const navigate = useNavigate();
    const { addAlert } = useAlert();

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
            
            addAlert('Usuário cadastrado com sucesso!', 'success');
            
            setTimeout(() => {
                navigate('/usuarios');
            }, 1500);
        } catch (err) {
            addAlert('Erro ao cadastrar usuário. Tente novamente.', 'error');
        }
    };

    return (
        <div className={`container-base container-cadastro ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <h1>Cadastro de Usuário</h1>
            <form onSubmit={handleSubmit}>
                {/* Conteúdo do formulário aqui... */}
                {/* (mantido o mesmo conteúdo do formulário para brevidade) */}
                
                <button type="submit" className="button-cadastrar">Cadastrar</button>
            </form>
        </div>
    );
};

export default CadastroUsuario;