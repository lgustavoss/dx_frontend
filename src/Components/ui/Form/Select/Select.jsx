import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import './Select.css';

/**
 * Componente Select reutilizável para seleção de opções predefinidas
 * Mantém consistência visual com outros componentes UI
 */
const Select = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  options = [],
  required,
  disabled,
  placeholder = "Selecione uma opção",
  errorMessage,
  fullWidth = false,
  className = '',
  labelKey = 'label',
  valueKey = 'value',
  variant = 'default', // 'default', 'error', 'success'
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  
  // Atualiza o label selecionado quando o valor muda
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => 
        (typeof option === 'object' ? option[valueKey] : option) === value
      );
      
      if (selectedOption) {
        setSelectedLabel(typeof selectedOption === 'object' ? selectedOption[labelKey] : selectedOption);
      } else {
        setSelectedLabel('');
      }
    } else {
      setSelectedLabel('');
    }
  }, [value, options, labelKey, valueKey]);
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
      
      // Atualiza o label selecionado
      const newValue = e.target.value;
      const selectedOption = options.find(option => 
        (typeof option === 'object' ? option[valueKey] : option) === newValue
      );
      
      if (selectedOption) {
        setSelectedLabel(typeof selectedOption === 'object' ? selectedOption[labelKey] : selectedOption);
      } else {
        setSelectedLabel('');
      }
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
  
  // Determinar classes CSS com base nas props
  const getSelectClasses = () => {
    let classes = 'select-input';
    
    if (variant === 'error') classes += ' select-input-error';
    if (variant === 'success') classes += ' select-input-success';
    if (disabled) classes += ' select-input-disabled';
    if (isFocused) classes += ' select-input-focused';
    
    return classes;
  };
  
  const renderOptions = () => {
    // Se não houver opções, mostrar apenas o placeholder
    if (!options || options.length === 0) {
      return <option value="" disabled>{placeholder}</option>;
    }
    
    // Renderizar placeholder (primeira opção vazia) e todas as opções
    return [
      <option key="placeholder" value="" disabled>{placeholder}</option>,
      ...options.map((option, index) => {
        // Determinar o valor e o texto a serem exibidos
        const optionValue = typeof option === 'object' ? option[valueKey] : option;
        const optionLabel = typeof option === 'object' ? option[labelKey] : option;
        
        return (
          <option key={index} value={optionValue}>
            {optionLabel}
          </option>
        );
      })
    ];
  };
  
  return (
    <div className={`select-component ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label htmlFor={id || name} className="select-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="select-container">
        <select
          ref={ref}
          id={id || name}
          name={name}
          value={value || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={getSelectClasses()}
          disabled={disabled}
          required={required}
          aria-invalid={variant === 'error'}
          aria-describedby={errorMessage ? `${id || name}-error` : undefined}
          {...props}
        >
          {renderOptions()}
        </select>
        
        <span className="select-icon">
          <FaChevronDown />
        </span>
        
        {variant === 'error' && (
          <span className="select-status-icon error-icon">
            <FaExclamationCircle />
          </span>
        )}
        
        {variant === 'success' && (
          <span className="select-status-icon success-icon">
            <FaCheckCircle />
          </span>
        )}
      </div>
      
      {errorMessage && variant === 'error' && (
        <div id={`${id || name}-error`} className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({})
    ])
  ),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'error', 'success'])
};

export default Select;