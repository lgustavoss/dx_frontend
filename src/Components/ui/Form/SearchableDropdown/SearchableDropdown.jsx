import React, { useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './SearchableDropdown.css';

/**
 * Componente dropdown pesquisável e selecionável
 * Substitui os componentes UFDropdown e CidadeDropdown com uma implementação mais flexível
 */
const SearchableDropdown = forwardRef(({
  id,
  name,
  label,
  placeholder = "Selecione ou pesquise",
  disabledPlaceholder = "Não disponível",
  options = [],
  value,
  onChange,
  onSelect,
  onBlur,
  onFocus,
  displayKey = "nome",
  valueKey = "id",
  secondaryKey,
  searchKeys = [],
  required,
  disabled = false,
  className = '',
  noOptionsMessage = "Nenhuma opção encontrada",
  showToggleIcon = true,
  toggleIcon = "▼",
  dependsOn = null,
  dependencyErrorMessage = "Selecione uma opção anterior primeiro",
  allowCustomValue = false
}, ref) => {
  // Estados
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  
  // Refs
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Efeito para atualizar o valor de exibição quando value muda externamente
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => 
        option[valueKey] === value || 
        option[displayKey] === value
      );
      
      if (selectedOption) {
        setDisplayValue(selectedOption[displayKey]);
      } else if (typeof value === 'string') {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue('');
    }
  }, [value, options, displayKey, valueKey]);
  
  // Efeito para atualizar as opções filtradas quando as opções mudam
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);
  
  // Efeito para gerenciar o foco no input quando o dropdown abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Gerenciar cliques fora do dropdown para fechá-lo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Abrir o dropdown
  const handleOpen = () => {
    if (disabled || (dependsOn !== null && !dependsOn)) return;
    
    setOriginalValue(displayValue);
    setSearchValue('');
    setIsOpen(true);
    
    if (onFocus) onFocus();
  };
  
  // Fechar o dropdown
  const handleClose = () => {
    setIsOpen(false);
    setSearchValue('');
    
    // Restaurar valor original se nenhum novo valor foi selecionado
    if (displayValue !== originalValue && !allowCustomValue) {
      setDisplayValue(originalValue);
    }
    
    if (onBlur) onBlur();
  };
  
  // Filtrar opções com base na pesquisa
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchValue(query);
    
    if (allowCustomValue) {
      setDisplayValue(query);
      
      if (onChange) {
        onChange({
          target: {
            name,
            value: query
          }
        });
      }
    }
    
    // Filtra as opções com base nas chaves de pesquisa
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      const filtered = options.filter(option => {
        // Se searchKeys está definido, pesquisa apenas nessas chaves
        if (searchKeys.length > 0) {
          return searchKeys.some(key => 
            option[key] && option[key].toString().toLowerCase().includes(lowercaseQuery)
          );
        }
        
        // Caso contrário, pesquisa em displayKey e secondaryKey (se fornecido)
        const matchesDisplayKey = option[displayKey] && 
          option[displayKey].toString().toLowerCase().includes(lowercaseQuery);
          
        const matchesSecondaryKey = secondaryKey && option[secondaryKey] && 
          option[secondaryKey].toString().toLowerCase().includes(lowercaseQuery);
          
        return matchesDisplayKey || matchesSecondaryKey;
      });
      
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  };
  
  // Selecionar uma opção do dropdown
  const handleSelect = (option) => {
    setDisplayValue(option[displayKey]);
    setIsOpen(false);
    
    if (onSelect) {
      onSelect(option);
    }
    
    if (onChange) {
      onChange({
        target: {
          name,
          value: option[valueKey] || option[displayKey]
        }
      });
    }
  };
  
  // Gerenciar o clique no ícone de toggle
  const handleToggleClick = (event) => {
    event.stopPropagation();
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };
  
  // Determinar o valor do placeholder
  const getPlaceholder = () => {
    if (disabled) return disabledPlaceholder;
    if (dependsOn === null || dependsOn) return placeholder;
    return dependencyErrorMessage;
  };
  
  // Gerenciar pressionamento de teclas
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Escape':
        handleClose();
        break;
      case 'Enter':
        if (isOpen && filteredOptions.length > 0) {
          handleSelect(filteredOptions[0]);
        } else if (!isOpen) {
          handleOpen();
        }
        break;
      case 'ArrowDown':
        if (!isOpen) handleOpen();
        break;
      default:
        break;
    }
  };
  
  return (
    <div className={`searchable-dropdown ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id || name} className="dropdown-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="dropdown-input-container">
        <input
          ref={inputRef}
          id={id || name}
          name={name}
          type="text"
          className="dropdown-input"
          value={isOpen ? searchValue : displayValue}
          onChange={handleSearch}
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={disabled || (dependsOn !== null && !dependsOn)}
          autoComplete="off"
        />
        
        {showToggleIcon && (
          <button 
            type="button"
            className="dropdown-toggle"
            onClick={handleToggleClick}
            disabled={disabled || (dependsOn !== null && !dependsOn)}
          >
            {toggleIcon}
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="dropdown-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div 
                key={option[valueKey] || option[displayKey]}
                className="dropdown-item"
                onClick={() => handleSelect(option)}
              >
                {secondaryKey ? (
                  `${option[displayKey]} ${option[secondaryKey] ? `- ${option[secondaryKey]}` : ''}`
                ) : (
                  option[displayKey]
                )}
              </div>
            ))
          ) : (
            <div className="dropdown-item dropdown-no-results">
              {noOptionsMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SearchableDropdown.displayName = 'SearchableDropdown';

SearchableDropdown.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabledPlaceholder: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  displayKey: PropTypes.string,
  valueKey: PropTypes.string,
  secondaryKey: PropTypes.string,
  searchKeys: PropTypes.array,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  noOptionsMessage: PropTypes.string,
  showToggleIcon: PropTypes.bool,
  toggleIcon: PropTypes.node,
  dependsOn: PropTypes.any,
  dependencyErrorMessage: PropTypes.string,
  allowCustomValue: PropTypes.bool
};

export default SearchableDropdown;