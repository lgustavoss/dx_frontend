import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Componente Card reutilizável baseado na estrutura detalhe-section
 * Encapsula seções com título e conteúdo em um formato visualmente consistente
 */
const Card = ({
  title,
  children,
  variant = 'default',
  padding = 'medium',
  bordered = true,
  noBorderBottom = false,
  fullWidth = false,
  className = '',
  titleLeftBordered = true,
  showHeader = true,
  headerAction,
  ...props
}) => {
  // Determinar as classes do card com base nas props
  const getCardClasses = () => {
    let classes = ['card', `card--${variant}`, `card--padding-${padding}`];
    
    if (bordered) classes.push('card--bordered');
    if (noBorderBottom) classes.push('card--no-border-bottom');
    if (fullWidth) classes.push('card--full-width');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };
  
  // Determinar as classes do título com base nas props
  const getTitleClasses = () => {
    let classes = ['card__title'];
    
    if (titleLeftBordered) classes.push('card__title--left-bordered');
    
    return classes.join(' ');
  };

  return (
    <div className={getCardClasses()} {...props}>
      {showHeader && (title || headerAction) && (
        <div className="card__header">
          {title && <h2 className={getTitleClasses()}>{title}</h2>}
          {headerAction && <div className="card__header-action">{headerAction}</div>}
        </div>
      )}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'outlined']),
  padding: PropTypes.oneOf(['small', 'medium', 'large', 'none']),
  bordered: PropTypes.bool,
  noBorderBottom: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  titleLeftBordered: PropTypes.bool,
  showHeader: PropTypes.bool,
  headerAction: PropTypes.node
};

export default Card;