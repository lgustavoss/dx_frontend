import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import './TextInput.css';

/**
 * Componente TextInput reutilizável 
 * Suporta diferentes variações, formatação e validação
 */
const TextInput = forwardRef(({
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  onSearch,
  isSearching,
  required,
  disabled,
  readOnly,
  icon,
  searchButtonTitle,
  errorMessage,
  fullWidth = false,
  autoFocus = false,
  className = '',
  type = 'text',
  formatter,
  maxLength,
  variant = 'default', // 'default', 'error', 'success'
  ...props
}, ref) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  
  // Atualiza o estado interno quando o valor externo muda
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Se houver um formatador, aplica-o
    let formattedValue = newValue;
    if (formatter) {
      formattedValue = formatter(newValue);
    }
    
    // Atualiza o estado interno
    setInputValue(formattedValue);
    
    // Chama o callback externo
    if (onChange) {
      // Cria um evento sintético com o valor formatado
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
          name
        }
      };
      onChange(syntheticEvent);
    }
  };
  
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Determinar classes CSS com base no variant
  const getInputClasses = () => {
    let classes = 'text-input';
    
    if (variant === 'error') classes += ' text-input-error';
    if (variant === 'success') classes += ' text-input-success';
    if (disabled) classes += ' text-input-disabled';
    if (readOnly) classes += ' text-input-readonly';
    if (isFocused) classes += ' text-input-focused';
    
    return classes;
  };
  
  return (
    <div className={`input-component ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label htmlFor={id || name} className="input-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        
        <input
          ref={ref}
          type={type}
          id={id || name}
          name={name}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={getInputClasses()}
          {...props}
        />
        
        {variant === 'error' && (
          <span className="input-status-icon error-icon">
            <FaExclamationCircle />
          </span>
        )}
        
        {variant === 'success' && (
          <span className="input-status-icon success-icon">
            <FaCheckCircle />
          </span>
        )}
        
        {onSearch && (
          <button
            type="button"
            className={`search-btn ${isSearching ? 'loading' : ''}`}
            onClick={onSearch}
            title={searchButtonTitle || "Buscar"}
            disabled={isSearching || disabled}
          >
            <FaSearch />
          </button>
        )}
      </div>
      
      {errorMessage && variant === 'error' && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
});

TextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSearch: PropTypes.func,
  isSearching: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  icon: PropTypes.node,
  searchButtonTitle: PropTypes.string,
  errorMessage: PropTypes.string,
  fullWidth: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  formatter: PropTypes.func,
  maxLength: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'error', 'success'])
};

TextInput.displayName = 'TextInput';

export default TextInput;