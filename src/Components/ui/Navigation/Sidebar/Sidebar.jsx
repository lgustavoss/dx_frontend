import { FaBars, FaUsers, FaUserCircle, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUI } from '../../../../contexts/ui/UIContext';
import './Sidebar.css';

const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, activeRoute } = useUI();
    
    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
                <FaBars className="hamburger-icon" onClick={toggleSidebar} />
                <h2>Menu</h2>
            </div>
            
            <ul className="menu-items">
                <li>
                    <Link 
                        to="/usuarios" 
                        className={`menu-button ${activeRoute === '/usuarios' ? 'active' : ''}`}
                    >
                        <FaUsers className="menu-icon" />
                        <span>Usuários</span>
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/clientes" 
                        className={`menu-button ${activeRoute === '/clientes' ? 'active' : ''}`}
                    >
                        <FaBuilding className="menu-icon" />
                        <span>Clientes</span>
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/perfil" 
                        className={`menu-button ${activeRoute === '/perfil' ? 'active' : ''}`}
                    >
                        <FaUserCircle className="menu-icon" />
                        <span>Perfil</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;