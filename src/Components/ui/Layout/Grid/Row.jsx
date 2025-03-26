import React from 'react';
import PropTypes from 'prop-types';
import './Grid.css';

/**
 * Componente Row para criar linhas no sistema de grid
 */
const Row = ({ 
  children, 
  spacing = 'medium',
  noGutters = false,
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  wrap = 'wrap',
  className = '',
  ...props 
}) => {
  const rowClasses = [
    'grid-row',
    `grid-row--spacing-${spacing}`,
    noGutters ? 'grid-row--no-gutters' : '',
    `grid-row--justify-${justifyContent}`,
    `grid-row--align-${alignItems}`,
    `grid-row--wrap-${wrap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={rowClasses} {...props}>
      {children}
    </div>
  );
};

Row.propTypes = {
  /** Conteúdo da linha */
  children: PropTypes.node,
  /** Espaçamento entre colunas */
  spacing: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /** Se true, remove as margens laterais */
  noGutters: PropTypes.bool,
  /** Alinhamento horizontal */
  justifyContent: PropTypes.oneOf([
    'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'
  ]),
  /** Alinhamento vertical */
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  /** Comportamento de quebra de linha */
  wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
  /** Classes CSS adicionais */
  className: PropTypes.string
};

export default Row;