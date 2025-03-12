import { useEffect, useState, useContext } from 'react';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api, addActivityListeners } from '../../../axiosConfig';
import './ListarCliente.css';
import { SidebarContext } from '../../Sidebar/SidebarContext';
import { useAlert } from '../../Alert/AlertContext';

const ListarCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
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
        <div className={`container-base container-cliente ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <h1>Clientes Cadastrados</h1>
            {loading ? (
                <p>Carregando clientes...</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>CNPJ</th>
                                <th>Nome Fantasia</th>
                                <th>Cidade/UF</th>
                                <th>Ações</th>
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
                    <button className="button-add add-button" onClick={handleAddCliente}>
                        <FaPlus />Novo Cliente
                    </button>
                </>
            )}
        </div>
    );
}

export default ListarCliente;