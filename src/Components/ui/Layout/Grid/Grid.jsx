import React from 'react';
import PropTypes from 'prop-types';
import './Grid.css';

/**
 * Componente Grid para criar layouts em grade responsivos
 * Wrapper principal para o sistema de grid
 */
const Grid = ({
  children,
  container = false,
  item = false,
  columns = 12,
  spacing = 'medium',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  className = '',
  ...props
}) => {
  const gridClasses = [
    'grid',
    container ? 'grid--container' : '',
    item ? 'grid--item' : '',
    `grid--spacing-${spacing}`,
    `grid--justify-${justifyContent}`,
    `grid--align-${alignItems}`,
    className
  ].filter(Boolean).join(' ');

  // Aplicar o número de colunas como variável CSS
  const gridStyle = {
    '--grid-columns': columns
  };

  return (
    <div className={gridClasses} style={gridStyle} {...props}>
      {children}
    </div>
  );
};

Grid.propTypes = {
  /** Conteúdo do grid */
  children: PropTypes.node,
  /** Se true, configura o grid como um container */
  container: PropTypes.bool,
  /** Se true, configura o grid como um item */
  item: PropTypes.bool,
  /** Número de colunas no grid */
  columns: PropTypes.number,
  /** Espaçamento entre itens */
  spacing: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /** Alinhamento horizontal dos itens */
  justifyContent: PropTypes.oneOf([
    'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'
  ]),
  /** Alinhamento vertical dos itens */
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  /** Classes CSS adicionais */
  className: PropTypes.string
};

export default Grid;