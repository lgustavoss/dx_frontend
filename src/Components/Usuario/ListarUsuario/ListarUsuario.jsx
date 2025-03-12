import { useEffect, useState, useContext } from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api, addActivityListeners } from '../../../axiosConfig';
import { SidebarContext } from '../../Sidebar/SidebarContext';
import './ListarUsuario.css';

const ListarUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
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
                
                addActivityListeners();
            } catch (err) {
                console.error('Error fetching users:', err.response ? err.response.data : err.message);
                setError('Erro ao buscar usuários. Tente novamente mais tarde.');
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
        <>
            <div className={`container-base container-usuario ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <h1>Usuários Cadastrados</h1>
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
                        {Array.isArray(usuarios) ? usuarios.map(usuario => (
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
                        )) : <tr><td colSpan="6">Carregando usuários...</td></tr>}
                    </tbody>
                </table>
                <br></br>
                <button className="button-add add-button" onClick={handleAddUser}>
                    <FaPlus />Novo Usuário
                </button>
            </div>
            {error && <div className="alert">{error}</div>}
        </>
    );
}

export default ListarUsuario;