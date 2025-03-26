import React from 'react';
import PropTypes from 'prop-types';
import './Grid.css';

/**
 * Componente Column para criar colunas no sistema de grid
 */
const Column = ({
  children,
  xs = 12,
  sm,
  md,
  lg,
  xl,
  offset = {},
  order = {},
  alignSelf = 'auto',
  className = '',
  ...props
}) => {
  // Construir classes para diferentes breakpoints
  const colClasses = [
    'grid-col',
    `grid-col--xs-${xs}`,
    sm ? `grid-col--sm-${sm}` : '',
    md ? `grid-col--md-${md}` : '',
    lg ? `grid-col--lg-${lg}` : '',
    xl ? `grid-col--xl-${xl}` : '',
    offset.xs ? `grid-col--offset-xs-${offset.xs}` : '',
    offset.sm ? `grid-col--offset-sm-${offset.sm}` : '',
    offset.md ? `grid-col--offset-md-${offset.md}` : '',
    offset.lg ? `grid-col--offset-lg-${offset.lg}` : '',
    offset.xl ? `grid-col--offset-xl-${offset.xl}` : '',
    order.xs ? `grid-col--order-xs-${order.xs}` : '',
    order.sm ? `grid-col--order-sm-${order.sm}` : '',
    order.md ? `grid-col--order-md-${order.md}` : '',
    order.lg ? `grid-col--order-lg-${order.lg}` : '',
    order.xl ? `grid-col--order-xl-${order.xl}` : '',
    `grid-col--align-${alignSelf}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={colClasses} {...props}>
      {children}
    </div>
  );
};

Column.propTypes = {
  /** Conteúdo da coluna */
  children: PropTypes.node,
  /** Largura em dispositivos extra pequenos (<576px) */
  xs: PropTypes.number,
  /** Largura em dispositivos pequenos (≥576px) */
  sm: PropTypes.number,
  /** Largura em dispositivos médios (≥768px) */
  md: PropTypes.number,
  /** Largura em dispositivos grandes (≥992px) */
  lg: PropTypes.number,
  /** Largura em dispositivos extra grandes (≥1200px) */
  xl: PropTypes.number,
  /** Deslocamento (offset) em diferentes breakpoints */
  offset: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  }),
  /** Ordem em diferentes breakpoints */
  order: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  }),
  /** Alinhamento vertical individual */
  alignSelf: PropTypes.oneOf(['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']),
  /** Classes CSS adicionais */
  className: PropTypes.string
};

export default Column;