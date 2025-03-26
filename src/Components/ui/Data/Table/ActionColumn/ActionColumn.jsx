import React from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaLock, FaUnlock, FaDownload } from 'react-icons/fa';
import { IconButton } from '../../Button';
import { TableCell } from '../';
import './ActionColumn.css';

/**
 * Componente para renderizar uma coluna de ações padronizada em tabelas
 * Suporta ações comuns como visualizar, editar, excluir, ativar/desativar, etc.
 */
const ActionColumn = ({
  actions = [],
  row,
  align = 'center',
  width = '120px',
  gap = 'small',
  className = '',
  stopPropagation = true,
  ...props
}) => {
  // Função para renderizar o ícone correto com base no tipo de ação
  const renderActionIcon = (actionType) => {
    switch (actionType) {
      case 'view':
        return <FaEye />;
      case 'edit':
        return <FaEdit />;
      case 'delete':
        return <FaTrash />;
      case 'activate':
        return <FaCheck />;
      case 'deactivate':
        return <FaTimes />;
      case 'lock':
        return <FaLock />;
      case 'unlock':
        return <FaUnlock />;
      case 'download':
        return <FaDownload />;
      default:
        return null;
    }
  };

  // Função que manipula o clique na ação e impede propagação se necessário
  const handleActionClick = (e, action) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    
    if (action.onClick) {
      action.onClick(row, e);
    }
  };

  return (
    <TableCell 
      align={align} 
      width={width}
      className={`action-column ${className}`}
      {...props}
    >
      <div className={`action-column__container action-column__gap-${gap}`}>
        {actions.map((action, index) => {
          // Se a condição for fornecida e for falsa, não renderiza o botão
          if (action.condition && !action.condition(row)) {
            return null;
          }

          // Decide o ícone (personalizado ou padrão pelo tipo)
          const icon = action.icon || renderActionIcon(action.type);
          
          // Decide a variante do botão (cor) com base no tipo da ação
          const variant = action.variant || 
            (action.type === 'delete' || action.type === 'deactivate' ? 'danger' : 
             action.type === 'activate' || action.type === 'view' ? 'success' : 
             'default');

          return (
            <IconButton
              key={`action-${index}-${action.type || 'custom'}`}
              size={action.size || 'small'}
              variant={variant}
              title={action.title || action.type}
              disabled={action.disabled}
              onClick={e => handleActionClick(e, action)}
              className={`action-column__button action-column__button--${action.type || 'custom'} ${action.className || ''}`}
            >
              {icon}
            </IconButton>
          );
        })}
      </div>
    </TableCell>
  );
};

ActionColumn.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['view', 'edit', 'delete', 'activate', 'deactivate', 'lock', 'unlock', 'download', 'custom']),
      onClick: PropTypes.func.isRequired,
      title: PropTypes.string,
      icon: PropTypes.node,
      condition: PropTypes.func,
      disabled: PropTypes.bool,
      variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info']),
      size: PropTypes.oneOf(['small', 'medium', 'large']),
      className: PropTypes.string
    })
  ).isRequired,
  row: PropTypes.object.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gap: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  stopPropagation: PropTypes.bool
};

export default ActionColumn;