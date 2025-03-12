import React from 'react';
import PropTypes from 'prop-types';
import './ConfirmationModal.css';

/**
 * Modal de confirmação para alterações importantes
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.show - Determina se o modal deve ser exibido
 * @param {string} props.title - Título do modal
 * @param {string} props.message - Mensagem de confirmação
 * @param {Function} props.onConfirm - Função executada ao confirmar ação
 * @param {Function} props.onCancel - Função executada ao cancelar ação
 * @returns {JSX.Element|null} Modal de confirmação ou null quando não exibido
 */
const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-cancel" 
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button 
            className="modal-btn modal-btn-confirm" 
            onClick={onConfirm}
            type="button"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmationModal;