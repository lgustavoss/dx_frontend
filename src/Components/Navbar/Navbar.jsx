import { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location = '/';
    };

    const handlePerfil = () => {
        setMenuOpen(false);
        navigate('/perfil');
    };

    if (!user) {
        return null;
    }

    return (
        <nav className="navbar">
            <FaBars className="hamburger-icon" onClick={toggleSidebar} />
            <div className="user-info" onClick={handleMenuToggle}>
                {user.photo ? (
                    <img src={user.photo} alt="User" className="user-photo" />
                ) : (
                    <FaUserCircle className="user-icon" />
                )}
                <span className="user-name">{user.first_name || user.username}</span>
            </div>
            {menuOpen && (
                <div className="dropdown-menu" ref={dropdownRef}>
                    <div className="dropdown-header">
                        {user.photo ? (
                            <img src={user.photo} alt="User" className="dropdown-photo" />
                        ) : (
                            <FaUserCircle className="dropdown-icon" />
                        )}
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    <div className="dropdown-footer">
                        <button onClick={handlePerfil}>Perfil</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;