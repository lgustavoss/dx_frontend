import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import './AlertContext.css';

/**
 * Contexto para sistema de alertas da aplicação
 * Fornece feedback visual ao usuário para diferentes tipos de eventos
 */
const AlertContext = createContext();

/**
 * Hook para usar o contexto de alertas em qualquer componente
 * @returns {Object} Funções e estados do contexto de alertas
 */
export const useAlert = () => useContext(AlertContext);

/**
 * Provedor do contexto de alertas
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 */
export const AlertProvider = ({ children }) => {
  // Estado para armazenar alertas ativos
  const [alerts, setAlerts] = useState([]);

  /**
   * Adiciona um alerta à lista
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo de alerta (success, error, info, warning)
   * @param {number} timeout - Tempo em milissegundos para o alerta desaparecer
   */
  const addAlert = useCallback((message, type = 'info', timeout = 5000) => {
    // Gera um ID único para o alerta
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    
    // Adiciona o novo alerta à lista
    setAlerts(prevAlerts => [...prevAlerts, { id, message, type, timeout }]);
    
    // Remove o alerta após o tempo definido
    if (timeout !== 0) {
      setTimeout(() => {
        removeAlert(id);
      }, timeout);
    }
  }, []);

  /**
   * Remove um alerta específico pela ID
   * @param {string} id - ID do alerta a ser removido
   */
  const removeAlert = useCallback((id) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id 
          ? { ...alert, isExiting: true } 
          : alert
      )
    );
    
    // Remove efetivamente após a animação de saída
    setTimeout(() => {
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    }, 500); // Tempo da animação de saída
  }, []);

  /**
   * Função de conveniência para adicionar alertas de sucesso
   * @param {string} message - Mensagem de sucesso
   * @param {number} timeout - Tempo em milissegundos
   */
  const addSuccess = useCallback((message, timeout) => {
    addAlert(message, 'success', timeout);
  }, [addAlert]);

  /**
   * Função de conveniência para adicionar alertas de erro
   * @param {string} message - Mensagem de erro
   * @param {number} timeout - Tempo em milissegundos
   */
  const addError = useCallback((message, timeout) => {
    addAlert(message, 'error', timeout);
  }, [addAlert]);

  /**
   * Função de conveniência para adicionar alertas de informação
   * @param {string} message - Mensagem informativa
   * @param {number} timeout - Tempo em milissegundos
   */
  const addInfo = useCallback((message, timeout) => {
    addAlert(message, 'info', timeout);
  }, [addAlert]);

  /**
   * Função de conveniência para adicionar alertas de aviso
   * @param {string} message - Mensagem de aviso
   * @param {number} timeout - Tempo em milissegundos
   */
  const addWarning = useCallback((message, timeout) => {
    addAlert(message, 'warning', timeout);
  }, [addAlert]);

  // Renderiza o alerta com o ícone correto baseado no tipo
  const renderAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="alert-icon" />;
      case 'error':
        return <FaTimesCircle className="alert-icon" />;
      case 'warning':
        return <FaExclamationTriangle className="alert-icon" />;
      case 'info':
      default:
        return <FaInfoCircle className="alert-icon" />;
    }
  };

  // Valores expostos pelo contexto
  const contextValue = {
    addAlert,
    addSuccess,
    addError,
    addInfo,
    addWarning,
    removeAlert
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <div className="global-alerts">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`alert alert-${alert.type} ${alert.isExiting ? 'alert-exit' : ''}`}
          >
            <div className="alert-content">
              {renderAlertIcon(alert.type)}
              <span className="alert-message">{alert.message}</span>
            </div>
            <button 
              className="alert-close-btn" 
              onClick={() => removeAlert(alert.id)}
              aria-label="Fechar"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AlertContext;