import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

/**
 * Componente para renderizar uma linha de tabela
 * Pode ser usado dentro do componente Table ou de forma independente
 */
const TableRow = ({
  children,
  onClick,
  isHeader = false,
  isLoading = false,
  isEmpty = false,
  className = '',
  selected = false,
  highlighted = false,
  keyPrefix,
  index,
  data,
  ...props
}) => {
  // Determina as classes CSS com base nas props
  const getRowClasses = () => {
    const classes = ['ui-table__row'];
    
    if (isHeader) classes.push('ui-table__header-row');
    if (isLoading) classes.push('ui-table__loading-row');
    if (isEmpty) classes.push('ui-table__empty-row');
    if (selected) classes.push('ui-table__row--selected');
    if (highlighted) classes.push('ui-table__row--highlighted');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  return (
    <tr 
      className={getRowClasses()}
      onClick={onClick && data ? () => onClick(data) : onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      {...props}
    >
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  isHeader: PropTypes.bool,
  isLoading: PropTypes.bool,
  isEmpty: PropTypes.bool,
  className: PropTypes.string,
  selected: PropTypes.bool,
  highlighted: PropTypes.bool,
  keyPrefix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  index: PropTypes.number,
  data: PropTypes.object
};

export default TableRow;