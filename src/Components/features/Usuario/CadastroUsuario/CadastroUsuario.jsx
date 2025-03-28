import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../../../axiosConfig";
import { useUI } from "../../../../contexts/ui/UIContext";
import { useAlert } from "../../../../contexts/alert/AlertContext";
import { Container, Box, Stack } from '../../../ui/Layout';
import Card from '../../../ui/Card/Card';
import { ButtonPrimary, ButtonSecondary } from '../../../ui/Button';
import './CadastroUsuario.css';

const CadastroUsuario = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        is_active: true,
        is_staff: false
    });
    const { isSidebarOpen } = useUI();
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
        <Container maxWidth="large" className={isSidebarOpen ? 'sidebar-open' : ''}>
            <Box padding="md" textAlign="center">
                <h1>Cadastro de Usuário</h1>
            </Box>
            
            <Card variant="primary" padding="md">
                <form onSubmit={handleSubmit}>
                    <Stack spacing="lg" direction="column">
                        <Grid container spacing="medium">
                            <Column xs={12} md={6}>
                                <div className="input-group">
                                    <label>Nome:</label>
                                    <input 
                                        type="text" 
                                        name="first_name" 
                                        value={formData.first_name} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </Column>
                            
                            <Column xs={12} md={6}>
                                <div className="input-group">
                                    <label>Username:</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </Column>
                            
                            <Column xs={12} md={6}>
                                <div className="input-group">
                                    <label>Email:</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </Column>
                            
                            <Column xs={12} md={6}>
                                <div className="input-group">
                                    <label>Senha:</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </Column>
                            
                            <Column xs={12} md={6}>
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
                                </div>
                            </Column>
                            
                            <Column xs={12} md={6}>
                                <div className="input-group switch-group">
                                    <label>Admin:</label>
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
                            </Column>
                        </Grid>
                        
                        <Stack direction="row" justifyContent="flex-end" spacing="md" marginTop="lg">
                            <ButtonSecondary type="button" onClick={() => navigate('/usuarios')}>
                                Cancelar
                            </ButtonSecondary>
                            <ButtonPrimary type="submit">
                                Cadastrar
                            </ButtonPrimary>
                        </Stack>
                    </Stack>
                </form>
            </Card>
        </Container>
    );
};

export default CadastroUsuario;