import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { ButtonPrimary, ButtonSecondary } from '../../Button';

/**
 * Modal para confirmações de ações do usuário
 * Exibe uma mensagem, título e botões de confirmação e cancelamento
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default', // 'default', 'warning', 'danger'
  width = 'small',
  className = '',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Determinação da classe de variante
  const getVariantClass = () => {
    switch (variant) {
      case 'warning':
        return 'modal-warning';
      case 'danger':
        return 'modal-danger';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={width}
      className={`confirmation-modal ${getVariantClass()} ${className}`}
      closeOnEscape={closeOnEscape}
      closeOnOverlayClick={closeOnOverlayClick}
      showCloseButton={showCloseButton}
    >
      <div className="modal-body">
        <p className="modal-message">{message}</p>
      </div>
      
      <div className="modal-footer">
        <ButtonSecondary onClick={onClose} size="small">
          {cancelText}
        </ButtonSecondary>
        <ButtonPrimary 
          onClick={handleConfirm} 
          size="small"
          variant={variant === 'danger' ? 'danger' : 'primary'}
        >
          {confirmText}
        </ButtonPrimary>
      </div>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'warning', 'danger']),
  width: PropTypes.oneOf(['small', 'medium', 'large', 'auto']),
  className: PropTypes.string,
  showCloseButton: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool
};

export default ConfirmationModal;