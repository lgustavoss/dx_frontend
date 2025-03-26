import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const EditableSelect = forwardRef(({
  name,
  value,
  onChange,
  onKeyDown,
  disabled,
  options = [],
  error,
  placeholder = 'Selecione...',
  valueKey = 'value',
  labelKey = 'label',
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  const renderOptions = () => {
    // Se não houver opções, mostrar apenas o placeholder
    if (!options || options.length === 0) {
      return <option value="" disabled>{placeholder}</option>;
    }
    
    // Renderizar placeholder e todas as opções
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
    <select
      ref={ref}
      name={name}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`editable-field__select ${error ? 'has-error' : ''}`}
      {...props}
    >
      {renderOptions()}
    </select>
  );
});

EditableSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string
};

EditableSelect.displayName = 'EditableSelect';

export default EditableSelect;