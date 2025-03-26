import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Botão para ações principais, como "Cadastrar", "Salvar", etc.
 */
const ButtonPrimary = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      variant="primary"
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

ButtonPrimary.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
};

export default ButtonPrimary;