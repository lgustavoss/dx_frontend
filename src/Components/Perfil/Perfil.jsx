import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { api } from '../../axiosConfig';
import './Perfil.css';

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        username: '',
        email: ''
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        setFormData({
            first_name: userData.first_name,
            username: userData.username,
            email: userData.email
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await api.patch(`/usuario/users/${user.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!user) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="container-perfil">
            <h1>Perfil do Usuário</h1>
            <div className="perfil-info">
                {user.photo ? (
                    <img src={user.photo} alt="User" className="perfil-photo" />
                ) : (
                    <div className="perfil-icon">👤</div>
                )}
                <div className="input-group">
                    <label>Nome:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                    <FaEdit className="edit-icon" onClick={handleEditClick} />
                </div>
                <div className="input-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                    <FaEdit className="edit-icon" onClick={handleEditClick} />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                    <FaEdit className="edit-icon" onClick={handleEditClick} />
                </div>
                {editMode && (
                    <button className="save-button" onClick={handleSaveClick}>
                        Salvar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Perfil;