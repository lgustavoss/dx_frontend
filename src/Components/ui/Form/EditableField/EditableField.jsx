import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import EditableText from './EditableFieldTypes/EditableText';
import EditableSelect from './EditableFieldTypes/EditableSelect';
import EditableDate from './EditableFieldTypes/EditableDate';
import EditableNumber from './EditableFieldTypes/EditableNumber';
import './EditableField.css';

/**
 * Componente genérico para edição in-place de campos
 * Suporta diferentes tipos de campos e customizações
 */
const EditableField = ({
  // Propriedades básicas
  label,
  name,
  value,
  type = 'text',
  onChange,
  onSave,
  onCancel,
  onSearch,
  isEditing = false,
  startEdit,
  cancelEdit,
  
  // Props de estilização e layout
  className = '',
  labelClassName = '',
  valueClassName = '',
  fullWidth = false,
  
  // Props de comportamento
  displayValue,
  emptyValuePlaceholder = 'Não informado',
  isSearching = false,
  disabled = false,
  nonEditable = false,
  autoSave = false,
  
  // Props para tipos específicos
  options = [],
  formatter,
  validator,
  searchButtonTitle = 'Buscar',
  
  // Props adicionais para cada tipo
  fieldProps = {},
  
  // Refs
  editRef = null,
  ...props
}) => {
  // Estado local para o valor em edição
  const [internalValue, setInternalValue] = useState(value || '');
  // Estado para rastrear erros de validação
  const [error, setError] = useState(null);
  // Refs
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  // Ref para o container de edição (usa o editRef fornecido ou o local)
  const editContainerRef = editRef || containerRef;

  // Atualiza o valor interno quando a prop value muda
  useEffect(() => {
    if (!isEditing) {
      setInternalValue(value || '');
    }
  }, [value, isEditing]);

  // Foca o input quando o modo de edição é ativado
  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
        if (type === 'text' || type === 'number') {
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isEditing, type]);

  // Handler para alterações no valor
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Validação, se houver um validator
    if (validator) {
      const validationResult = validator(newValue);
      if (validationResult !== true) {
        setError(validationResult);
        setInternalValue(newValue);
        return;
      }
      setError(null);
    }
    
    setInternalValue(newValue);
    
    // Propaga a mudança para o componente pai
    if (onChange) {
      onChange(name, newValue, e);
    }
    
    // Auto-salva se a opção estiver ativada
    if (autoSave && !error) {
      handleSave(newValue);
    }
  };

  // Handler para salvar alterações
  const handleSave = (valueToSave = internalValue) => {
    // Não salva se houver erro de validação
    if (error) return;
    
    // Não salva se o valor não mudou
    if (valueToSave === value && value !== '') return;
    
    // Chama o callback de salvamento
    if (onSave) {
      onSave(name, valueToSave);
    }
  };

  // Handler para cancelar edição
  const handleCancel = () => {
    setInternalValue(value || '');
    setError(null);
    
    if (onCancel) {
      onCancel(name);
    }
  };

  // Handler para teclas especiais
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Handler para busca (se aplicável)
  const handleSearch = () => {
    if (onSearch && !isSearching) {
      onSearch(name, internalValue);
    }
  };

  // Renderiza o campo de edição apropriado para o tipo
  const renderEditField = () => {
    const commonProps = {
      name,
      value: internalValue,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      disabled,
      ref: inputRef,
      error,
      ...fieldProps
    };

    switch (type) {
      case 'select':
        return <EditableSelect options={options} {...commonProps} />;
      case 'date':
        return <EditableDate {...commonProps} />;
      case 'number':
        return <EditableNumber {...commonProps} />;
      case 'textarea':
        return <EditableText multiline {...commonProps} />;
      case 'text':
      default:
        return <EditableText {...commonProps} />;
    }
  };

  // Formatar o valor para exibição
  const getFormattedDisplayValue = () => {
    if (displayValue !== undefined) return displayValue;
    
    if (!value && value !== 0) return emptyValuePlaceholder;
    
    if (formatter) return formatter(value);
    
    if (type === 'select' && options.length > 0) {
      const option = options.find(
        opt => (typeof opt === 'object' ? opt.value : opt) === value
      );
      return option 
        ? (typeof option === 'object' ? option.label : option) 
        : value;
    }
    
    return value;
  };

  return (
    <div className={`editable-field ${fullWidth ? 'editable-field--full-width' : ''} ${className}`}>
      {label && (
        <label className={`editable-field__label ${labelClassName}`}>
          {label}:
        </label>
      )}

      {isEditing ? (
        <div className="editable-field__edit-container" ref={editContainerRef}>
          <div className="editable-field__input-wrapper">
            {renderEditField()}
            {error && <div className="editable-field__error">{error}</div>}
          </div>
          
          <div className="editable-field__actions">
            {onSearch && (
              <button 
                className={`editable-field__search-btn ${isSearching ? 'loading' : ''}`}
                onClick={handleSearch}
                disabled={isSearching || disabled || !!error}
                title={searchButtonTitle}
                type="button"
                aria-label={searchButtonTitle}
              >
                <FaSearch />
              </button>
            )}
            
            <button 
              className="editable-field__save-btn"
              onClick={() => handleSave()}
              disabled={disabled || !!error}
              title="Salvar"
              type="button"
              aria-label="Salvar"
            >
              <FaSave />
            </button>
            
            <button 
              className="editable-field__cancel-btn"
              onClick={handleCancel}
              disabled={disabled}
              title="Cancelar"
              type="button"
              aria-label="Cancelar"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className={`editable-field__display ${valueClassName}`}>
          <span className="editable-field__value">
            {getFormattedDisplayValue()}
          </span>
          
          {!nonEditable && !disabled && startEdit && (
            <button 
              className="editable-field__edit-btn"
              onClick={() => startEdit(name, value)}
              title={`Editar ${label || name}`}
              type="button"
              aria-label={`Editar ${label || name}`}
            >
              <FaEdit />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

EditableField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  type: PropTypes.oneOf(['text', 'textarea', 'select', 'number', 'date']),
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onSearch: PropTypes.func,
  isEditing: PropTypes.bool,
  startEdit: PropTypes.func,
  cancelEdit: PropTypes.func,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  valueClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  displayValue: PropTypes.node,
  emptyValuePlaceholder: PropTypes.node,
  isSearching: PropTypes.bool,
  disabled: PropTypes.bool,
  nonEditable: PropTypes.bool,
  autoSave: PropTypes.bool,
  options: PropTypes.array,
  formatter: PropTypes.func,
  validator: PropTypes.func,
  searchButtonTitle: PropTypes.string,
  fieldProps: PropTypes.object,
  editRef: PropTypes.object
};

export default EditableField;