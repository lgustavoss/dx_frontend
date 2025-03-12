import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../axiosConfig';
import { SidebarContext } from '../../Sidebar/SidebarContext';
import { useAlert } from '../../Alert/AlertContext';
import './CadastroCliente.css';

const CadastroCliente = () => {
    const [formData, setFormData] = useState({
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        endereco: '',
        cep: '',
        cidade_id: '',
        estado_id: '',
        responsavel_cpf: '',
        responsavel_rg: '',
        responsavel_nome: '',
        responsavel_data_nascimento: '',
        responsavel_estado_civil: '',
        responsavel_email: '',
        email_financeiro: ''
    });

    const { isSidebarOpen } = useContext(SidebarContext);
    const navigate = useNavigate();
    const { addAlert } = useAlert();
    
    // Lista de estados civis
    const estadosCivis = [
        { value: 'solteiro', label: 'Solteiro' },
        { value: 'casado', label: 'Casado' },
        { value: 'divorciado', label: 'Divorciado' },
        { value: 'viuvo', label: 'Viúvo' },
        { value: 'uniao_estavel', label: 'União Estável' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Remove caracteres especiais para campos de documentos
        if (name === 'cnpj' || name === 'responsavel_cpf' || name === 'cep') {
            setFormData({ ...formData, [name]: value.replace(/\D/g, '') });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cliente/clientes/', formData);
            
            addAlert('Cliente cadastrado com sucesso!', 'success');
            
            setTimeout(() => {
                navigate('/clientes');
            }, 1500);
        } catch (err) {
            console.error('Erro ao cadastrar cliente:', err);
            addAlert('Erro ao cadastrar cliente. Verifique os dados e tente novamente.', 'error');
        }
    };

    return (
        <div className={`container-base container-cadastro-cliente ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <h1>Cadastro de Cliente</h1>
            
            <form onSubmit={handleSubmit}>
                {/* Conteúdo do formulário aqui... */}
                {/* (mantido o mesmo conteúdo do formulário para brevidade) */}
                
                <div className="buttons-container">
                    <button type="button" className="button-cancelar" onClick={() => navigate('/clientes')}>
                        Cancelar
                    </button>
                    <button type="submit" className="button-cadastrar">
                        Cadastrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CadastroCliente;