import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes, FaHistory } from 'react-icons/fa';
import TextInput from '../TextInput';
import { useDebounce } from '../../../../hooks/useDebounce';
import './SearchInput.css';

/**
 * Componente de busca avançado com funcionalidades como debounce, histórico e feedback visual
 */
const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar...',
  debounceTime = 300,
  minQueryLength = 2,
  showClearButton = true,
  showSearchHistory = false,
  maxHistoryItems = 5,
  autoSearchOnType = false,
  className = '',
  label,
  name = 'search',
  id,
  disabled = false,
  readOnly = false,
  required = false,
  searchButtonTitle = 'Buscar',
  variant = 'default', // 'default', 'error', 'success'
  errorMessage,
  fullWidth = false,
  autoFocus = false,
  ...props
}) => {
  // Estados
  const [query, setQuery] = useState(value || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Refs
  const historyRef = useRef(null);
  
  // Debounce
  const debouncedQuery = useDebounce(query, debounceTime);
  
  // Carrega histórico de buscas do localStorage
  useEffect(() => {
    if (showSearchHistory) {
      try {
        const savedHistory = localStorage.getItem(`search-history-${name}`);
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Erro ao carregar histórico de busca:', error);
      }
    }
  }, [showSearchHistory, name]);
  
  // Efeito para sincronizar o valor interno com o valor da prop
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);
  
  // Efeito para realizar busca automática quando o usuário digita (se habilitado)
  useEffect(() => {
    if (autoSearchOnType && debouncedQuery && debouncedQuery.length >= minQueryLength) {
      handleSearch();
    }
  }, [debouncedQuery, autoSearchOnType, minQueryLength]);
  
  // Efeito para lidar com cliques fora do componente de histórico
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Salvar item no histórico
  const saveToHistory = useCallback((searchQuery) => {
    if (!showSearchHistory || !searchQuery.trim()) return;
    
    setSearchHistory(prevHistory => {
      // Remove item duplicado se já existir
      const filteredHistory = prevHistory.filter(item => item !== searchQuery);
      // Adiciona o novo item no início e limita o tamanho
      const newHistory = [searchQuery, ...filteredHistory].slice(0, maxHistoryItems);
      
      // Salva no localStorage
      try {
        localStorage.setItem(`search-history-${name}`, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Erro ao salvar histórico de busca:', error);
      }
      
      return newHistory;
    });
  }, [showSearchHistory, maxHistoryItems, name]);
  
  // Lidar com a busca
  const handleSearch = useCallback(() => {
    if (!query || query.length < minQueryLength) return;
    
    if (onSearch) {
      setIsSearching(true);
      saveToHistory(query);
      
      const searchPromise = onSearch(query);
      
      // Se a função onSearch retornar uma Promise, aguardamos sua resolução
      if (searchPromise && typeof searchPromise.then === 'function') {
        searchPromise
          .then(() => setIsSearching(false))
          .catch(() => setIsSearching(false));
      } else {
        // Se não for uma Promise, finalizamos o estado de busca imediatamente
        setIsSearching(false);
      }
    }
  }, [query, onSearch, minQueryLength, saveToHistory]);
  
  // Lidar com alterações no input
  const handleChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    
    if (onChange) {
      onChange(e);
    }
  };
  
  // Lidar com pressionar Enter no input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowHistory(false);
    } else if (e.key === 'ArrowDown' && showHistory) {
      const historyItems = document.querySelectorAll('.search-history-item');
      if (historyItems.length > 0) {
        historyItems[0].focus();
      }
    }
  };
  
  // Limpar o campo de busca
  const handleClear = () => {
    setQuery('');
    
    if (onChange) {
      // Criar um evento sintético para manter a consistência da API
      const syntheticEvent = {
        target: {
          name,
          value: ''
        }
      };
      onChange(syntheticEvent);
    }
    
    // Disparar evento de busca vazia se configurado para auto-busca
    if (autoSearchOnType && onSearch) {
      onSearch('');
    }
  };
  
  // Selecionar item do histórico
  const handleSelectHistory = (historyItem) => {
    setQuery(historyItem);
    setShowHistory(false);
    
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: historyItem
        }
      };
      onChange(syntheticEvent);
    }
    
    // Executa busca automaticamente quando seleciona do histórico
    setTimeout(() => {
      onSearch(historyItem);
    }, 0);
  };
  
  // Remover item do histórico
  const handleRemoveFromHistory = (e, historyItem) => {
    e.stopPropagation();
    
    setSearchHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item !== historyItem);
      
      // Atualiza localStorage
      try {
        localStorage.setItem(`search-history-${name}`, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Erro ao atualizar histórico de busca:', error);
      }
      
      return newHistory;
    });
  };
  
  // Mostrar componente de histórico
  const toggleHistory = () => {
    if (searchHistory.length > 0) {
      setShowHistory(prev => !prev);
    }
  };
  
  // Navegar pelo histórico com teclado
  const handleHistoryKeyDown = (e, historyItem, index) => {
    if (e.key === 'Enter') {
      handleSelectHistory(historyItem);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const historyItems = document.querySelectorAll('.search-history-item');
      if (index < historyItems.length - 1) {
        historyItems[index + 1].focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const historyItems = document.querySelectorAll('.search-history-item');
      if (index > 0) {
        historyItems[index - 1].focus();
      } else {
        // Voltar para o input
        const inputElement = document.getElementById(id || name);
        if (inputElement) {
          inputElement.focus();
        }
      }
    }
  };
  
  return (
    <div className={`search-input-wrapper ${className}`} ref={historyRef}>
      <TextInput
        id={id || name}
        name={name}
        label={label}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => showSearchHistory && searchHistory.length > 0 && setShowHistory(true)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        icon={<FaSearch className="search-icon" />}
        onSearch={handleSearch}
        isSearching={isSearching}
        searchButtonTitle={searchButtonTitle}
        className="search-text-input"
        variant={variant}
        errorMessage={errorMessage}
        fullWidth={fullWidth}
        autoFocus={autoFocus}
        {...props}
      />
      
      {showClearButton && query && (
        <button
          type="button"
          className="clear-search-button"
          onClick={handleClear}
          title="Limpar busca"
        >
          <FaTimes />
        </button>
      )}
      
      {showSearchHistory && searchHistory.length > 0 && (
        <button
          type="button"
          className="history-toggle-button"
          onClick={toggleHistory}
          title="Histórico de busca"
        >
          <FaHistory />
        </button>
      )}
      
      {showHistory && searchHistory.length > 0 && (
        <div className="search-history-container">
          <div className="search-history-header">
            <span>Buscas recentes</span>
          </div>
          <div className="search-history-list">
            {searchHistory.map((historyItem, index) => (
              <div
                key={`${historyItem}-${index}`}
                className="search-history-item"
                onClick={() => handleSelectHistory(historyItem)}
                onKeyDown={(e) => handleHistoryKeyDown(e, historyItem, index)}
                tabIndex="0"
              >
                <FaHistory className="history-item-icon" />
                <span className="history-item-text">{historyItem}</span>
                <button
                  type="button"
                  className="remove-history-item"
                  onClick={(e) => handleRemoveFromHistory(e, historyItem)}
                  title="Remover do histórico"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  debounceTime: PropTypes.number,
  minQueryLength: PropTypes.number,
  showClearButton: PropTypes.bool,
  showSearchHistory: PropTypes.bool,
  maxHistoryItems: PropTypes.number,
  autoSearchOnType: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  searchButtonTitle: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'error', 'success']),
  errorMessage: PropTypes.string,
  fullWidth: PropTypes.bool,
  autoFocus: PropTypes.bool
};

export default SearchInput;