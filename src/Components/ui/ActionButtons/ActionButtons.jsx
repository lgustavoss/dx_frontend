import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaSave, FaTimes, FaSearch, FaTrash } from 'react-icons/fa';
import { IconButton } from '../Button';
import './ActionButtons.css';

/**
 * Componente para exibir conjunto de botões de ação (editar, salvar, cancelar)
 * Pode ser configurado para mostrar diferentes combinações de botões
 */
const ActionButtons = ({
  mode = 'view', // 'view', 'edit', 'custom'
  onEdit,
  onSave,
  onCancel,
  onSearch,
  onDelete,
  isSearching = false,
  showEdit = true,
  showSave = true,
  showCancel = true,
  showSearch = false,
  showDelete = false,
  disabled = false,
  editTitle = "Editar",
  saveTitle = "Salvar",
  cancelTitle = "Cancelar",
  searchTitle = "Buscar",
  deleteTitle = "Excluir",
  className = '',
  size = 'medium', // 'small', 'medium', 'large'
  position = 'right', // 'left', 'right', 'center'
  gap = 'default', // 'small', 'default', 'large'
  ...props
}) => {
  const getContainerClass = () => {
    const classes = ['action-buttons'];
    classes.push(`action-buttons--${position}`);
    classes.push(`action-buttons--gap-${gap}`);
    if (className) classes.push(className);
    return classes.join(' ');
  };

  // Renderiza os botões de acordo com o modo
  const renderButtons = () => {
    switch (mode) {
      case 'view':
        // No modo visualização, mostra apenas botão de editar
        return (
          showEdit && (
            <IconButton
              onClick={onEdit}
              title={editTitle}
              disabled={disabled}
              size={size}
              variant="default"
              className="action-edit-button"
              {...props}
            >
              <FaEdit />
            </IconButton>
          )
        );
        
      case 'edit':
        // No modo edição, mostra botões de salvar e cancelar
        return (
          <>
            {showSearch && (
              <IconButton
                onClick={onSearch}
                title={searchTitle}
                disabled={disabled || isSearching}
                size={size}
                variant="success"
                className={`action-search-button ${isSearching ? 'searching' : ''}`}
                {...props}
              >
                <FaSearch />
              </IconButton>
            )}
            {showSave && (
              <IconButton
                onClick={onSave}
                title={saveTitle}
                disabled={disabled}
                size={size}
                variant="success"
                className="action-save-button"
                {...props}
              >
                <FaSave />
              </IconButton>
            )}
            {showCancel && (
              <IconButton
                onClick={onCancel}
                title={cancelTitle}
                disabled={disabled}
                size={size}
                variant="danger"
                className="action-cancel-button"
                {...props}
              >
                <FaTimes />
              </IconButton>
            )}
          </>
        );
        
      case 'custom':
        // No modo customizado, mostra qualquer combinação de botões
        return (
          <>
            {showEdit && (
              <IconButton
                onClick={onEdit}
                title={editTitle}
                disabled={disabled}
                size={size}
                variant="default"
                className="action-edit-button"
                {...props}
              >
                <FaEdit />
              </IconButton>
            )}
            {showSearch && (
              <IconButton
                onClick={onSearch}
                title={searchTitle}
                disabled={disabled || isSearching}
                size={size}
                variant="success"
                className={`action-search-button ${isSearching ? 'searching' : ''}`}
                {...props}
              >
                <FaSearch />
              </IconButton>
            )}
            {showSave && (
              <IconButton
                onClick={onSave}
                title={saveTitle}
                disabled={disabled}
                size={size}
                variant="success"
                className="action-save-button"
                {...props}
              >
                <FaSave />
              </IconButton>
            )}
            {showCancel && (
              <IconButton
                onClick={onCancel}
                title={cancelTitle}
                disabled={disabled}
                size={size}
                variant="danger"
                className="action-cancel-button"
                {...props}
              >
                <FaTimes />
              </IconButton>
            )}
            {showDelete && (
              <IconButton
                onClick={onDelete}
                title={deleteTitle}
                disabled={disabled}
                size={size}
                variant="danger"
                className="action-delete-button"
                {...props}
              >
                <FaTrash />
              </IconButton>
            )}
          </>
        );
        
      default:
        return null;
    }
  };

  return <div className={getContainerClass()}>{renderButtons()}</div>;
};

ActionButtons.propTypes = {
  mode: PropTypes.oneOf(['view', 'edit', 'custom']),
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onSearch: PropTypes.func,
  onDelete: PropTypes.func,
  isSearching: PropTypes.bool,
  showEdit: PropTypes.bool,
  showSave: PropTypes.bool,
  showCancel: PropTypes.bool,
  showSearch: PropTypes.bool,
  showDelete: PropTypes.bool,
  disabled: PropTypes.bool,
  editTitle: PropTypes.string,
  saveTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  searchTitle: PropTypes.string,
  deleteTitle: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  position: PropTypes.oneOf(['left', 'right', 'center']),
  gap: PropTypes.oneOf(['small', 'default', 'large'])
};

export default ActionButtons;