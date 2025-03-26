import { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../axiosConfig';
import { SidebarContext } from '../../../Components/ui/Navigation';
import { useAlert } from '../../../Components/ui/Feedback/Alert/AlertContext';
import { FormattedInputField } from '../../../Components/ui/Form';
import { useLocationSelectors } from '../../../hooks/useLocationSelectors';
import { useCepSearch } from '../../../hooks/useCepSearch';
import { useCnpjSearch } from '../../../hooks/useCnpjSearch';
import { Container, Card, Grid, Column, Stack, Box, Divider } from '../../../Components/ui/Layout';
import { ButtonPrimary, ButtonSecondary } from '../../../Components/ui/Button';
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
    
    // Hooks
    const { isSidebarOpen } = useContext(SidebarContext);
    const navigate = useNavigate();
    const { addAlert } = useAlert();
    
    // Usar os hooks personalizados para busca de CEP e CNPJ
    const { isSearchingCep, processarCep } = useCepSearch();
    const { isSearchingCnpj, processarCnpj } = useCnpjSearch();
    
    // Hook de localização para gerenciar UFs e Cidades
    const locationSelectors = useLocationSelectors();
    
    // Desestruturação de props do hook useLocationSelectors
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
    }, [setSearchCidade, setSearchCidadeInternal, fetchCidades]);

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
            
            // Envia para API
            await api.post('/cliente/clientes/', payload);
            
            addAlert('Cliente cadastrado com sucesso!', 'success');
            setTimeout(() => {
                navigate('/clientes');
            }, 1500);
        } catch (err) {
            console.error('Erro ao cadastrar cliente:', err);
            addAlert('Erro ao cadastrar cliente. Verifique os dados e tente novamente.', 'error');
        }
    };

    // Handler para detectar cliques fora dos dropdowns e fechá-los
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

    return (
        <Container maxWidth="large" className={isSidebarOpen ? 'sidebar-open' : ''}>
            <Box padding="md" textAlign="center">
                <h1>Cadastro de Cliente</h1>
            </Box>
            
            <form onSubmit={handleSubmit}>
                <Stack spacing="lg" direction="column">
                    <Card title="Informações da Empresa" variant="primary" titleLeftBordered>
                        <Grid container spacing="medium">
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="CNPJ*" 
                                    name="cnpj" 
                                    value={formData.cnpj}
                                    onChange={handleInputChange}
                                    onSearch={handleBuscarCnpj}
                                    isSearching={isSearchingCnpj}
                                    placeholder="00.000.000/0000-00"
                                    required
                                />
                            </Column>
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="Razão Social*" 
                                    name="razao_social" 
                                    value={formData.razao_social}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Column>
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="Nome Fantasia" 
                                    name="nome_fantasia" 
                                    value={formData.nome_fantasia}
                                    onChange={handleInputChange}
                                />
                            </Column>
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="Email Financeiro" 
                                    name="email_financeiro" 
                                    value={formData.email_financeiro}
                                    onChange={handleInputChange}
                                />
                            </Column>
                        </Grid>
                    </Card>
                
                    <Card title="Endereço" variant="primary" titleLeftBordered>
                        <Grid container spacing="medium">
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="CEP" 
                                    name="cep" 
                                    value={formData.cep}
                                    onChange={handleInputChange}
                                    onSearch={handleBuscarCep}
                                    isSearching={isSearchingCep}
                                    placeholder="00000-000"
                                />
                            </Column>
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="Endereço" 
                                    name="endereco" 
                                    value={formData.endereco}
                                    onChange={handleInputChange}
                                />
                            </Column>
                            <Column xs={12} md={6}>
                                <div className="form-group">
                                    <label>Estado*</label>
                                    <div className="location-dropdown-container" ref={ufRef}>
                                        <input
                                            type="text"
                                            ref={searchUfRef}
                                            value={formData.estado_sigla}
                                            onClick={() => setShowUfDropdown(true)}
                                            readOnly
                                            placeholder="Selecione um estado"
                                            className="form-input"
                                        />
                                        {showUfDropdown && (
                                            <div className="dropdown-content">
                                                <input
                                                    type="text"
                                                    placeholder="Filtrar UFs..."
                                                    value={searchUf}
                                                    onChange={(e) => setSearchUf(e.target.value)}
                                                    className="form-input"
                                                />
                                                <div className="dropdown-item-list">
                                                    {ufs.filter(uf => 
                                                        uf.sigla.toLowerCase().includes(searchUf.toLowerCase()) || 
                                                        uf.nome.toLowerCase().includes(searchUf.toLowerCase())
                                                    ).map(uf => (
                                                        <div
                                                            key={uf.id}
                                                            className="dropdown-item"
                                                            onClick={() => handleUfSelect(uf)}
                                                        >
                                                            {uf.sigla} - {uf.nome}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Column>
                            <Column xs={12} md={6}>
                                <div className="form-group">
                                    <label>Cidade*</label>
                                    <div className="location-dropdown-container" ref={cidadeRef}>
                                        <input
                                            type="text"
                                            ref={searchCidadeRef}
                                            value={formData.cidade_nome}
                                            onClick={() => {
                                                if (formData.estado_id) {
                                                    setShowCidadeDropdown(true);
                                                } else {
                                                    addAlert('Selecione um estado primeiro', 'warning');
                                                }
                                            }}
                                            readOnly
                                            placeholder="Selecione uma cidade"
                                            className="form-input"
                                        />
                                        {showCidadeDropdown && (
                                            <div className="dropdown-content">
                                                <input
                                                    type="text"
                                                    placeholder="Filtrar cidades..."
                                                    value={searchCidade}
                                                    onChange={(e) => setSearchCidade(e.target.value)}
                                                    className="form-input"
                                                />
                                                <div className="dropdown-item-list">
                                                    {cidades.filter(cidade =>
                                                        cidade.nome.toLowerCase().includes(searchCidade.toLowerCase())
                                                    ).map(cidade => (
                                                        <div
                                                            key={cidade.id}
                                                            className="dropdown-item"
                                                            onClick={() => handleCidadeSelect(cidade)}
                                                        >
                                                            {cidade.nome}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Column>
                        </Grid>
                    </Card>
                    
                    <Card title="Responsável" variant="primary" titleLeftBordered>
                        <Grid container spacing="medium">
                            <Column xs={12} md={8}>
                                <FormattedInputField 
                                    label="Nome" 
                                    name="responsavel_nome" 
                                    value={formData.responsavel_nome}
                                    onChange={handleInputChange}
                                />
                            </Column>
                            <Column xs={12} md={4}>
                                <FormattedInputField 
                                    label="Data de Nascimento" 
                                    name="responsavel_data_nascimento" 
                                    value={formData.responsavel_data_nascimento}
                                    onChange={handleInputChange}
                                    type="date"
                                />
                            </Column>
                            <Column xs={12} md={8}>
                                <FormattedInputField 
                                    label="Email" 
                                    name="responsavel_email" 
                                    value={formData.responsavel_email}
                                    onChange={handleInputChange}
                                    type="email"
                                />
                            </Column>
                            <Column xs={12} md={4}>
                                <div className="form-group">
                                    <label htmlFor="responsavel_estado_civil">Estado Civil</label>
                                    <select
                                        id="responsavel_estado_civil"
                                        name="responsavel_estado_civil"
                                        value={formData.responsavel_estado_civil}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="">Selecione...</option>
                                        {estadosCivis.map(estadoCivil => (
                                            <option key={estadoCivil.value} value={estadoCivil.value}>
                                                {estadoCivil.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Column>
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="CPF" 
                                    name="responsavel_cpf" 
                                    value={formData.responsavel_cpf}
                                    onChange={handleInputChange}
                                    placeholder="000.000.000-00"
                                />
                            </Column>
                            <Column xs={12} md={6}>
                                <FormattedInputField 
                                    label="RG" 
                                    name="responsavel_rg" 
                                    value={formData.responsavel_rg}
                                    onChange={handleInputChange}
                                />
                            </Column>
                        </Grid>
                    </Card>

                    <Box marginTop="lg">
                        <Divider margin="medium" />
                        <Stack direction="row" justifyContent="flex-end" spacing="md">
                            <ButtonSecondary type="button" onClick={() => navigate('/clientes')}>
                                Cancelar
                            </ButtonSecondary>
                            <ButtonPrimary type="submit">
                                Cadastrar
                            </ButtonPrimary>
                        </Stack>
                    </Box>
                </Stack>
            </form>
        </Container>
    );
};

export default CadastroCliente;