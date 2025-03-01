import { FaBars } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <FaBars className="hamburger-icon" onClick={toggleSidebar} />
            <ul>
                <li><a href="/usuarios">Usuários</a></li>
                <li><a href="/perfil">Perfil</a></li>
                {/* Adicione mais links conforme necessário */}
            </ul>
        </div>
    );
}

export default Sidebar;