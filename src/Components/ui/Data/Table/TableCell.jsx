import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

/**
 * Componente para renderizar uma célula de tabela
 * Pode ser usado dentro do TableRow ou de forma independente
 */
const TableCell = ({
  children,
  isHeader = false,
  colSpan = 1,
  width,
  align = 'left',
  className = '',
  truncate = false,
  dataLabel,
  ...props
}) => {
  // Determina as classes CSS com base nas props
  const getCellClasses = () => {
    const classes = [
      isHeader ? 'ui-table__header-cell' : 'ui-table__cell',
      `ui-table__cell--align-${align}`
    ];
    
    if (truncate) classes.push('ui-table__cell--truncate');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  // Determina o estilo inline da célula
  const getCellStyle = () => {
    const style = {};
    
    if (width) {
      style.width = typeof width === 'number' ? `${width}px` : width;
    }
    
    return style;
  };

  const Tag = isHeader ? 'th' : 'td';

  return (
    <Tag 
      className={getCellClasses()}
      colSpan={colSpan}
      style={getCellStyle()}
      data-label={dataLabel}
      {...props}
    >
      {children}
    </Tag>
  );
};

TableCell.propTypes = {
  children: PropTypes.node,
  isHeader: PropTypes.bool,
  colSpan: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
  truncate: PropTypes.bool,
  dataLabel: PropTypes.string
};

export default TableCell;