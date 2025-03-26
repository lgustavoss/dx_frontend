import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import LoadingIndicator from './LoadingIndicator';
import './Loading.css';

/**
 * Componente que exibe um overlay de carregamento
 * Pode cobrir a tela inteira ou um elemento específico
 */
const LoadingOverlay = ({
  isLoading = true,
  message = 'Carregando...',
  blur = true,
  opacity = 0.7,
  zIndex = 1000,
  color = 'primary',
  size = 'large',
  type = 'spinner',
  fullScreen = true,
  containerRef = null,
  onClick = null,
  preventClick = true,
  className = '',
  ...props
}) => {
  if (!isLoading) return null;

  const getOverlayStyle = () => {
    return {
      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      backdropFilter: blur ? 'blur(4px)' : 'none',
      zIndex: zIndex
    };
  };

  const handleClick = (e) => {
    if (preventClick) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (onClick) onClick(e);
  };

  const overlayClasses = [
    'loading-overlay',
    fullScreen ? 'loading-overlay--full-screen' : 'loading-overlay--container',
    className
  ].filter(Boolean).join(' ');

  const overlayContent = (
    <div 
      className={overlayClasses}
      style={getOverlayStyle()}
      onClick={handleClick}
      {...props}
    >
      <div className="loading-overlay__content">
        <LoadingIndicator 
          size={size} 
          color={color} 
          type={type}
        />
        {message && <p className="loading-overlay__message">{message}</p>}
      </div>
    </div>
  );

  if (fullScreen) {
    return createPortal(overlayContent, document.body);
  }

  if (containerRef && containerRef.current) {
    // Se um ref de container for fornecido, adicione a classe relativa e retorne
    // o overlay (sem createPortal)
    return overlayContent;
  }

  return overlayContent;
};

LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool,
  message: PropTypes.string,
  blur: PropTypes.bool,
  opacity: PropTypes.number,
  zIndex: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'white', 'success', 'error']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse']),
  fullScreen: PropTypes.bool,
  containerRef: PropTypes.object,
  onClick: PropTypes.func,
  preventClick: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingOverlay;