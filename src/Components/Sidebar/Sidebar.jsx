import { FaBars, FaUsers, FaUserCircle, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
                <FaBars className="hamburger-icon" onClick={toggleSidebar} />
                <h2>Menu</h2>
            </div>
            
            <ul className="menu-items">
                <li>
                    <Link to="/usuarios" className="menu-button">
                        <FaUsers className="menu-icon" />
                        <span>Usuários</span>
                    </Link>
                </li>
                <li>
                    <Link to="/clientes" className="menu-button">
                        <FaBuilding className="menu-icon" />
                        <span>Clientes</span>
                    </Link>
                </li>
                <li>
                    <Link to="/perfil" className="menu-button">
                        <FaUserCircle className="menu-icon" />
                        <span>Perfil</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;