import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Botão com ícone, otimizado para exibir ícones com ou sem texto
 */
const IconButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  size = 'medium',
  variant = 'default',
  className = '',
  title,
  ...props
}) => {
  // Adiciona classe icon-button para estilização específica
  const iconButtonClass = `icon-button ${className}`;
  
  return (
    <Button
      onClick={onClick}
      type={type}
      disabled={disabled}
      size={size}
      variant={variant}
      className={iconButtonClass}
      title={title}
      {...props}
    >
      {children}
    </Button>
  );
};

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'success']),
  className: PropTypes.string,
  title: PropTypes.string
};

export default IconButton;