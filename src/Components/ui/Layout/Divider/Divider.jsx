import React from 'react';
import PropTypes from 'prop-types';
import './Divider.css';

/**
 * Componente Divider para criar linhas divisórias horizontal ou vertical
 */
const Divider = ({
  orientation = 'horizontal',
  variant = 'default',
  spacing = 'medium',
  thickness = 'thin',
  color = 'default',
  margin = 'default',
  text,
  textPosition = 'center',
  className = '',
  ...props
}) => {
  const dividerClasses = [
    'divider',
    `divider--${orientation}`,
    `divider--variant-${variant}`,
    `divider--spacing-${spacing}`,
    `divider--thickness-${thickness}`,
    `divider--color-${color}`,
    `divider--margin-${margin}`,
    text ? 'divider--with-text' : '',
    text ? `divider--text-position-${textPosition}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={dividerClasses} role="separator" {...props}>
      {text && (
        <span className="divider__text">{text}</span>
      )}
    </div>
  );
};

Divider.propTypes = {
  /** Orientação do divisor */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Variante do estilo */
  variant: PropTypes.oneOf(['default', 'dashed', 'dotted']),
  /** Espaçamento interno */
  spacing: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Espessura da linha */
  thickness: PropTypes.oneOf(['thin', 'medium', 'thick']),
  /** Cor do divisor */
  color: PropTypes.oneOf(['default', 'light', 'primary', 'secondary']),
  /** Margens */
  margin: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  /** Texto opcional no divider */
  text: PropTypes.node,
  /** Posição do texto */
  textPosition: PropTypes.oneOf(['left', 'center', 'right']),
  /** Classes CSS adicionais */
  className: PropTypes.string
};

export default Divider;