import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Componente Button base reutilizável
 * Serve como fundação para outros tipos de botões
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  size = 'medium',
  variant = 'default',
  className = '',
  title,
  ...props
}) => {
  // Classes do botão com base nas props
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'success', 'icon']),
  className: PropTypes.string,
  title: PropTypes.string
};

export default Button;