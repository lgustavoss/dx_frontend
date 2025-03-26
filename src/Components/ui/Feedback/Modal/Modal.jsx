import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';

/**
 * Componente Modal base, fornece a estrutura e comportamento comum para todos os tipos de modais
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  width = 'medium',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  ...props
}) => {
  // Ref para o elemento do modal
  const modalRef = useRef(null);

  // Gerencia o foco quando o modal abre
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Encontra o primeiro elemento focável dentro do modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // Gerencia o pressionamento da tecla Escape para fechar o modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Previne a rolagem do body quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handler para clique no overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Não renderiza nada se o modal não estiver aberto
  if (!isOpen) return null;

  // Usa createPortal para renderizar o modal diretamente no body
  return createPortal(
    <div 
      className={`modal-overlay ${overlayClassName}`}
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div 
        ref={modalRef}
        className={`modal-container modal-width-${width} ${className}`}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            {showCloseButton && (
              <button 
                type="button"
                className="modal-close-btn" 
                onClick={onClose}
                aria-label="Fechar"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  width: PropTypes.oneOf(['small', 'medium', 'large', 'auto']),
  closeOnEscape: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  overlayClassName: PropTypes.string
};

export default Modal;