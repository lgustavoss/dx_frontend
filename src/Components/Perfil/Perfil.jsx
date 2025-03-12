import { useEffect, useState, useRef, useContext } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../axiosConfig';
import { useAlert } from '../Alert/AlertContext';
import { SidebarContext } from '../Sidebar/SidebarContext';
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
        const inputRef = useRef(null); // Novo ref para o cursor
        
        // Nova função para preservar a posição do cursor
        const handleInputChange = (e) => {
            const input = e.target;
            const newValue = input.value;
            
            // Captura tanto o início quanto o fim da seleção
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
            <div className="info-item">
                <label>{label}:</label>
                {isEditing ? (
                    <div className="edit-container" ref={editRef}>
                        <input
                            ref={inputRef} // Adiciona a referência ao elemento
                            type="text"
                            value={editValue}
                            onChange={handleInputChange} // Usa a nova função personalizada
                            className="edit-input"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveEdit();
                                }
                            }}
                        />
                        <div className="edit-buttons">
                            <button className="save-btn" onClick={saveEdit} title="Salvar">
                                <FaSave />
                            </button>
                            <button className="cancel-btn" onClick={cancelEdit} title="Cancelar">
                                <FaTimes />
                            </button>
                        </div>
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
            </div>
        );
    };

    if (!user) {
        return (
            <div className={`container-base container-perfil ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <h1>Carregando informações do usuário...</h1>
            </div>
        );
    }

    return (
        <div className={`container-base container-perfil ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Imagem de perfil no canto superior direito */}
            <div className="profile-image-container">
                {user.photo ? (
                    <img src={user.photo} alt="User" className="perfil-photo" />
                ) : (
                    <div className="perfil-icon">👤</div>
                )}
            </div>
            
            <h1>Perfil do Usuário</h1>
            
            <div className="detalhe-section">
                <h2>Informações Pessoais</h2>
                
                <div className="info-grid">
                    <EditableField 
                        label="Nome" 
                        field="first_name" 
                        value={user.first_name || ''}
                    />
                    
                    <EditableField 
                        label="Username" 
                        field="username" 
                        value={user.username || ''}
                    />
                    
                    <EditableField 
                        label="Email" 
                        field="email" 
                        value={user.email || ''}
                    />
                </div>
            </div>
        </div>
    );
}

export default Perfil;