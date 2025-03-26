import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import './Breadcrumbs.css';

/**
 * Componente de trilha de navegação (breadcrumbs)
 * Permite visualizar e navegar pela hierarquia de páginas
 */
const Breadcrumbs = ({
  items = [],
  separator = <FaChevronRight />,
  showHome = true,
  homeText = 'Início',
  homePath = '/',
  homeIcon = <FaHome />,
  onNavigate = null,
  className = '',
  maxItems = 0,
  ariaLabel = 'Navegação hierárquica',
}) => {
  // Se não houver itens e não mostrar home, não renderiza nada
  if (items.length === 0 && !showHome) return null;
  
  // Se maxItems for fornecido e válido, limita o número de itens
  let displayItems = [...items];
  if (maxItems > 0 && items.length > maxItems) {
    // Mantém o primeiro e os últimos itens baseado no maxItems
    const lastItems = Math.max(1, maxItems - 1);
    displayItems = [
      items[0],
      { label: '...', path: null },
      ...items.slice(items.length - lastItems)
    ];
  }
  
  // Handler para navegação
  const handleClick = (path, e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };
  
  return (
    <nav 
      className={`breadcrumbs ${className}`} 
      aria-label={ariaLabel}
    >
      <ol className="breadcrumbs__list">
        {showHome && (
          <li className="breadcrumbs__item">
            <Link 
              to={homePath} 
              className="breadcrumbs__link breadcrumbs__link--home"
              onClick={(e) => handleClick(homePath, e)}
            >
              {homeIcon}
              <span className="breadcrumbs__text">{homeText}</span>
            </Link>
            {(items.length > 0) && (
              <span className="breadcrumbs__separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        )}
        
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          // O último item não é clicável (página atual)
          if (isLast || !item.path) {
            return (
              <li 
                key={`breadcrumb-${index}`} 
                className={`breadcrumbs__item ${isLast ? 'breadcrumbs__item--active' : ''}`}
                aria-current={isLast ? 'page' : undefined}
              >
                <span className="breadcrumbs__text">
                  {item.label}
                </span>
              </li>
            );
          }
          
          return (
            <li key={`breadcrumb-${index}`} className="breadcrumbs__item">
              <Link 
                to={item.path} 
                className="breadcrumbs__link"
                onClick={(e) => handleClick(item.path, e)}
              >
                {item.icon && (
                  <span className="breadcrumbs__icon">{item.icon}</span>
                )}
                <span className="breadcrumbs__text">{item.label}</span>
              </Link>
              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      icon: PropTypes.node
    })
  ),
  separator: PropTypes.node,
  showHome: PropTypes.bool,
  homeText: PropTypes.string,
  homePath: PropTypes.string,
  homeIcon: PropTypes.node,
  onNavigate: PropTypes.func,
  className: PropTypes.string,
  maxItems: PropTypes.number,
  ariaLabel: PropTypes.string
};

export default Breadcrumbs;