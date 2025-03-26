import { useEffect, useState, useRef, useContext } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../axiosConfig';
import { useAlert } from '../../Components/ui/Feedback/Alert/AlertContext';
import { SidebarContext } from '../../Components/ui/Navigation/Sidebar/SidebarContext';
import { Container, Card, Box, Grid, Column, Stack, Divider } from '../../Components/ui/Layout';
import './Perfil.css';

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const editRef = useRef(null);
    const { addAlert } = useAlert();
    const { isSidebarOpen } = useContext(SidebarContext);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    // Event listener para detectar cliques fora do campo de edição
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editRef.current && !editRef.current.contains(event.target) && editingField) {
                saveEdit();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingField, editValue]);

    // Event listener para detectar tecla ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && editingField) {
                cancelEdit();
            }
        };
        
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [editingField]);

    // Iniciar edição de um campo
    const startEdit = (field, value) => {
        setEditingField(field);
        setEditValue(value);
    };

    // Cancelar a edição do campo
    const cancelEdit = () => {
        setEditingField(null);
    };

    // Salvar a edição do campo
    const saveEdit = async () => {
        if (!editingField || user[editingField] === editValue) {
            setEditingField(null);
            return;
        }

        try {
            const payload = {
                [editingField]: editValue
            };

            await api.patch(`/usuario/users/${user.id}/`, payload);
            
            const updatedUser = {...user, ...payload};
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            addAlert(`Campo ${editingField} atualizado com sucesso!`, 'success');
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            addAlert('Erro ao atualizar usuário. Tente novamente.', 'error');
        }

        setEditingField(null);
    };

    // Componente para renderizar campos editáveis
    const EditableField = ({ label, field, value }) => {
        const isEditing = editingField === field;
        const inputRef = useRef(null);
        
        // Função para preservar a posição do cursor
        const handleInputChange = (e) => {
            const input = e.target;
            const newValue = input.value;
            
            const selectionStart = input.selectionStart;
            const selectionEnd = input.selectionEnd;
            const hadSelection = selectionStart !== selectionEnd;
            
            setEditValue(newValue);
            
            // Preserva a seleção ou posição do cursor após a atualização do estado
            setTimeout(() => {
                if (inputRef.current) {
                    if (hadSelection) {
                        // Se havia texto selecionado, posiciona o cursor no final do que acabou de ser digitado
                        const newCursorPos = selectionStart + 1;
                        inputRef.current.selectionStart = newCursorPos;
                        inputRef.current.selectionEnd = newCursorPos;
                    } else {
                        // Caso contrário, mantém o cursor na mesma posição
                        inputRef.current.selectionStart = selectionStart;
                        inputRef.current.selectionEnd = selectionEnd;
                    }
                }
            }, 0);
        };
        
        return (
            <Box className="info-item" margin="sm">
                <label>{label}:</label>
                {isEditing ? (
                    <div className="edit-container" ref={editRef}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={editValue}
                            onChange={handleInputChange}
                            className="edit-input"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveEdit();
                                }
                            }}
                        />
                        <Stack direction="row" spacing="sm" className="edit-buttons">
                            <button className="save-btn" onClick={saveEdit} title="Salvar">
                                <FaSave />
                            </button>
                            <button className="cancel-btn" onClick={cancelEdit} title="Cancelar">
                                <FaTimes />
                            </button>
                        </Stack>
                    </div>
                ) : (
                    <div className="value-container">
                        <span>{value}</span>
                        <button 
                            className="edit-btn"
                            onClick={() => startEdit(field, value)}
                            title={`Editar ${label}`}
                        >
                            <FaEdit />
                        </button>
                    </div>
                )}
            </Box>
        );
    };

    if (!user) {
        return (
            <Container maxWidth="large" className={isSidebarOpen ? 'sidebar-open' : ''}>
                <Box padding="lg" display="flex" justifyContent="center">
                    <h1>Carregando informações do usuário...</h1>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="large" className={isSidebarOpen ? 'sidebar-open' : ''}>
            {/* Imagem de perfil no canto superior direito */}
            <Box className="profile-image-container">
                {user.photo ? (
                    <img src={user.photo} alt="User" className="perfil-photo" />
                ) : (
                    <div className="perfil-icon">👤</div>
                )}
            </Box>
            
            <Box textAlign="center" margin="md">
                <h1>Perfil do Usuário</h1>
            </Box>
            
            <Card title="Informações Pessoais" variant="primary" titleLeftBordered>
                <Grid container spacing="medium">
                    <Column xs={12} md={6}>
                        <EditableField 
                            label="Nome" 
                            field="first_name" 
                            value={user.first_name || ''}
                        />
                    </Column>
                    <Column xs={12} md={6}>
                        <EditableField 
                            label="Username" 
                            field="username" 
                            value={user.username || ''}
                        />
                    </Column>
                    <Column xs={12}>
                        <EditableField 
                            label="Email" 
                            field="email" 
                            value={user.email || ''}
                        />
                    </Column>
                </Grid>
            </Card>
        </Container>
    );
}

export default Perfil;