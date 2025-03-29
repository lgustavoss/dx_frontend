import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { ButtonPrimary, ButtonSecondary } from "../../Button";

/**
 * Modal para exibir formulários
 * Fornece uma estrutura de modal com cabeçalho, corpo para formulário e rodapé com botões
 */
const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Salvar',
  cancelText = 'Cancelar',
  width = 'medium',
  loading = false,
  isValid = true,
  className = '',
  showFooter = true,
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  extraButtons,
  footer,
}) => {
  // Handler para o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && !loading && onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={width}
      className={`form-modal ${className}`}
      closeOnEscape={closeOnEscape}
      closeOnOverlayClick={closeOnOverlayClick}
      showCloseButton={showCloseButton}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {children}
        </div>
        
        {showFooter && (
          <div className="modal-footer">
            {footer || (
              <>
                <ButtonSecondary 
                  type="button" 
                  onClick={onClose} 
                  size="small"
                  disabled={loading}
                >
                  {cancelText}
                </ButtonSecondary>
                
                {extraButtons}
                
                <ButtonPrimary 
                  type="submit" 
                  size="small"
                  disabled={!isValid || loading}
                >
                  {loading ? 'Carregando...' : submitText}
                </ButtonPrimary>
              </>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  width: PropTypes.oneOf(['small', 'medium', 'large', 'auto']),
  loading: PropTypes.bool,
  isValid: PropTypes.bool,
  className: PropTypes.string,
  showFooter: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  extraButtons: PropTypes.node,
  footer: PropTypes.node
};

export default FormModal;