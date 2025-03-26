import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

/**
 * Componente que exibe um indicador de carregamento
 * Pode ser usado em botões, cards, seções etc.
 */
const LoadingIndicator = ({
  size = 'medium',
  color = 'primary',
  centered = false,
  text = null,
  type = 'spinner', // 'spinner', 'dots', 'pulse'
  className = '',
  fullWidth = false,
  ...props
}) => {
  const getLoadingClass = () => {
    const classes = [
      'loading-indicator',
      `loading-indicator--${size}`,
      `loading-indicator--${color}`,
      `loading-indicator--${type}`,
      centered ? 'loading-indicator--centered' : '',
      fullWidth ? 'loading-indicator--full-width' : '',
      className
    ];
    
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className={getLoadingClass()} {...props}>
      {type === 'spinner' && (
        <div className="loading-spinner"></div>
      )}
      
      {type === 'dots' && (
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}
      
      {type === 'pulse' && (
        <div className="loading-pulse"></div>
      )}
      
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

LoadingIndicator.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'white', 'success', 'error']),
  centered: PropTypes.bool,
  text: PropTypes.string,
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool
};

export default LoadingIndicator;