import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../../../contexts/ui/UIContext';
import { useCliente } from '../../../../contexts/cliente/ClienteContext';
import { useAlert } from '../../../../contexts/alert/AlertContext';
import { FormattedInputField } from '../../../ui/Form';
import { useCepSearch } from "../../../../hooks/useCepSearch";
import { useCnpjSearch } from "../../../../hooks/useCnpjSearch";
import { useLocationSelectors } from "../../../../hooks/useLocationSelectors";
import { Container, Grid, Column, Stack, Box, Divider } from '../../../ui/Layout';
import Card from '../../../ui/Card/Card';
import { ButtonPrimary, ButtonSecondary } from '../../../ui/Button';
import './CadastroCliente.css';

const CadastroCliente = () => {
    // Estados e referências
    const [formData, setFormData] = useState({
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        endereco: '',
        cep: '',
        cidade_id: '',
        estado_id: '',
        estado_sigla: '', // Campo auxiliar para exibição
        cidade_nome: '',  // Campo auxiliar para exibição
        responsavel_cpf: '',
        responsavel_rg: '',
        responsavel_nome: '',
        responsavel_data_nascimento: '',
        responsavel_estado_civil: '',
        responsavel_email: '',
        email_financeiro: ''
    });
    
    // Hooks de contexto
    const { isSidebarOpen } = useUI();
    const { createCliente } = useCliente(); // 👈 Nova linha - usando o contexto
    const navigate = useNavigate();
    const { addAlert } = useAlert();
    
    // Hooks personalizados
    const { isSearchingCep, processarCep } = useCepSearch();
    const { isSearchingCnpj, processarCnpj } = useCnpjSearch();
    
    // Hook de localização
    const locationSelectors = useLocationSelectors();
    
    // Desestruturação dos valores do hook
    const {
        ufs,
        cidades,
        selectedUf,
        searchUf,
        searchCidade,
        setSearchUf,
        setSearchCidade,
        setSearchUfInternal,
        setSearchCidadeInternal,
        showUfDropdown,
        showCidadeDropdown,
        setShowUfDropdown,
        setShowCidadeDropdown,
        fetchUFs,
        fetchCidades
    } = locationSelectors;
    
    // Referências para os componentes de dropdown
    const ufRef = useRef(null);
    const cidadeRef = useRef(null);
    const searchUfRef = useRef(null);
    const searchCidadeRef = useRef(null);
    
    // Lista de estados civis
    const estadosCivis = [
        { value: 'solteiro', label: 'Solteiro' },
        { value: 'casado', label: 'Casado' },
        { value: 'divorciado', label: 'Divorciado' },
        { value: 'viuvo', label: 'Viúvo' },
        { value: 'uniao_estavel', label: 'União Estável' }
    ];

    // Carrega as UFs na inicialização
    useEffect(() => {
        fetchUFs();
    }, [fetchUFs]);

    // Handler para mudanças em campos de input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handler para seleção de UF
    const handleUfSelect = useCallback((uf) => {
        setFormData(prevState => ({
            ...prevState,
            estado_id: uf.id,
            estado_sigla: uf.sigla,
            cidade_id: '',
            cidade_nome: ''
        }));
        
        // Limpar seleção de cidade e buscar cidades da UF selecionada
        setSearchCidade('');
        setSearchCidadeInternal('');
        fetchCidades(uf.sigla);
        setShowUfDropdown(false);
    }, [setSearchCidade, setSearchCidadeInternal, fetchCidades, setShowUfDropdown]);

    // Handler para seleção de cidade
    const handleCidadeSelect = useCallback((cidade) => {
        setFormData(prevState => ({
            ...prevState,
            cidade_id: cidade.id,
            cidade_nome: cidade.nome
        }));
        setShowCidadeDropdown(false);
    }, [setShowCidadeDropdown]);

    // Função para buscar dados por CEP
    const handleBuscarCep = async () => {
        const cepValue = formData.cep.replace(/\D/g, '');
        
        const dadosEndereco = await processarCep(cepValue);
        
        if (dadosEndereco) {
            // Atualiza o formulário com os dados do endereço
            setFormData(prevState => ({
                ...prevState,
                ...dadosEndereco
            }));
            
            // Atualiza os dropdowns de UF e cidade
            setSearchUf(dadosEndereco.estado_sigla);
            setSearchUfInternal(dadosEndereco.estado_sigla);
            setSearchCidade(dadosEndereco.cidade_nome);
            setSearchCidadeInternal(dadosEndereco.cidade_nome);
            
            // Carrega as cidades para o dropdown
            fetchCidades(dadosEndereco.estado_sigla);
            
            addAlert('Endereço encontrado e preenchido automaticamente!', 'success');
        }
    };
    
    // Função para buscar dados por CNPJ
    const handleBuscarCnpj = async () => {
        const cnpjValue = formData.cnpj.replace(/\D/g, '');
        
        const dadosCnpj = await processarCnpj(cnpjValue);
        
        if (dadosCnpj) {
            // Atualiza o formulário com os dados do CNPJ
            setFormData(prevState => ({
                ...prevState,
                ...dadosCnpj
            }));
            
            // Se tiver dados de localização, atualiza os dropdowns
            if (dadosCnpj.estado_sigla && dadosCnpj.cidade_nome) {
                setSearchUf(dadosCnpj.estado_sigla);
                setSearchUfInternal(dadosCnpj.estado_sigla);
                setSearchCidade(dadosCnpj.cidade_nome);
                setSearchCidadeInternal(dadosCnpj.cidade_nome);
                
                // Carrega as cidades para o dropdown
                fetchCidades(dadosCnpj.estado_sigla);
            }
            
            // Se o CNPJ retornou um CEP, tenta buscar o endereço completo
            if (dadosCnpj.cep && dadosCnpj.cep.length === 8) {
                const enderecoByCep = await processarCep(dadosCnpj.cep);
                
                if (enderecoByCep) {
                    setFormData(prevState => ({
                        ...prevState,
                        ...enderecoByCep
                    }));
                }
            }
            
            addAlert('Dados do CNPJ encontrados e preenchidos automaticamente!', 'success');
        }
    };

    // Envia o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!formData.cnpj || !formData.razao_social || !formData.cidade_id || !formData.estado_id) {
            addAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        try {
            // Prepara payload removendo formatações de campos especiais
            const payload = {
                ...formData,
                cnpj: formData.cnpj.replace(/\D/g, ''),
                cep: formData.cep.replace(/\D/g, ''),
                responsavel_cpf: formData.responsavel_cpf.replace(/\D/g, '')
            };
            
            // Remove campos auxiliares que não devem ser enviados para a API
            delete payload.estado_sigla;
            delete payload.cidade_nome;
            
            // Usa o contexto em vez da chamada direta à API
            const response = await createCliente(payload);
            
            if (response) {
                setTimeout(() => {
                    navigate('/clientes');
                }, 1500);
            }
        } catch (err) {
            console.error('Erro ao cadastrar cliente:', err);
            addAlert('Erro ao cadastrar cliente. Verifique os dados e tente novamente.', 'error');
        }
    };

    // Handler para detectar cliques fora dos dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ufRef.current && !ufRef.current.contains(event.target)) {
                setShowUfDropdown(false);
            }
            if (cidadeRef.current && !cidadeRef.current.contains(event.target)) {
                setShowCidadeDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowUfDropdown, setShowCidadeDropdown]);

    // Resto do componente mantido igual...
    
    return (
        <Container maxWidth="large" className={isSidebarOpen ? 'sidebar-open' : ''}>
            <Box padding="md" textAlign="center">
                <h1>Cadastro de Cliente</h1>
            </Box>

            {/* Resto do JSX mantido igual */}
            {/* ... */}
        </Container>
    );
};

export default CadastroCliente;