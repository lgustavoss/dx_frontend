import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

/**
 * Campo de entrada formatado com botão de busca opcional
 * 
 * @param {Object} props - Propriedades do componente
 * @returns {JSX.Element} Componente de campo formatado
 */
const FormattedInputField = ({
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  onSearch,
  isSearching,
  required,
  searchButtonTitle,
  fullWidth = false,
  className = ''
}) => {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && <label htmlFor={id || name}>{label}{required && '*'}</label>}
      <div className="input-with-button">
        <input
          type="text"
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        {onSearch && (
          <button
            type="button"
            className={`search-btn ${isSearching ? 'loading' : ''}`}
            onClick={onSearch}
            title={searchButtonTitle || "Buscar"}
            disabled={isSearching}
          >
            <FaSearch />
          </button>
        )}
      </div>
    </div>
  );
};

FormattedInputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  isSearching: PropTypes.bool,
  required: PropTypes.bool,
  searchButtonTitle: PropTypes.string,
  fullWidth: PropTypes.bool,
  className: PropTypes.string
};

export { FormattedInputField };