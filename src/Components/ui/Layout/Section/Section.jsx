import React from 'react';
import PropTypes from 'prop-types';
import './Section.css';

/**
 * Componente Section reutilizável
 * Encapsula seções com título e conteúdo em um formato visualmente consistente,
 * baseado no padrão detalhe-section do projeto
 */
const Section = ({
  title,
  children,
  noBorder = false,
  className = '',
  leftBorderedTitle = true,
  showHeader = true,
  headerAction,
  fullWidth = false,
  ...props
}) => {
  // Determinar as classes da seção com base nas props
  const getSectionClasses = () => {
    const classes = ['ui-section'];
    
    if (noBorder) classes.push('ui-section--no-border');
    if (fullWidth) classes.push('ui-section--full-width');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };
  
  // Determinar as classes do título com base nas props
  const getTitleClasses = () => {
    const classes = ['ui-section__title'];
    
    if (leftBorderedTitle) classes.push('ui-section__title--left-bordered');
    
    return classes.join(' ');
  };

  return (
    <div className={getSectionClasses()} {...props}>
      {showHeader && (title || headerAction) && (
        <div className="ui-section__header">
          {title && <h2 className={getTitleClasses()}>{title}</h2>}
          {headerAction && <div className="ui-section__header-action">{headerAction}</div>}
        </div>
      )}
      <div className="ui-section__content">
        {children}
      </div>
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  className: PropTypes.string,
  leftBorderedTitle: PropTypes.bool,
  showHeader: PropTypes.bool,
  headerAction: PropTypes.node,
  fullWidth: PropTypes.bool
};

export default Section;