import React, { createContext, useState, useContext, useCallback } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import './AlertContext.css';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  
  // Primeiro declare removeAlert
  const removeAlert = useCallback((id) => {
    console.log(`Preparando para remover alerta ${id}`);
    
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id 
          ? { ...alert, isExiting: true } 
          : alert
      )
    );
    
    // Remove efetivamente após a animação de saída
    setTimeout(() => {
      console.log(`Removendo efetivamente alerta ${id}`);
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    }, 500); // Tempo da animação de saída
  }, []);
  
  // Função para gerar ID único
  const generateId = () => `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Depois use removeAlert em addAlert
  const addAlert = useCallback((message, type = 'info', timeout = 5000) => {
    // Força timeout mínimo para cada tipo de alerta
    let actualTimeout = timeout;
    if (type === 'error') actualTimeout = Math.max(timeout, 15000); // Mínimo 15 segundos para erros
    if (type === 'success') actualTimeout = Math.max(timeout, 3000); // Mínimo 3 segundos para sucesso
    
    console.log(`Adicionando alerta "${message}" (${type}) com timeout: ${actualTimeout}ms`);
    
    const id = generateId();
    
    setAlerts(prevAlerts => [
      ...prevAlerts, 
      { id, message, type, createdAt: Date.now() }
    ]);
    
    console.log(`Alerta ${id} será removido após ${actualTimeout}ms`);
    
    // Usa setTimeout diretamente com o valor de timeout
    const timerId = setTimeout(() => {
      console.log(`Tempo esgotado para alerta ${id}, removendo...`);
      removeAlert(id);
    }, actualTimeout);
    
    // Armazena o ID do timer para limpeza se necessário
    return id;
  }, [removeAlert]);
  
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
}

/**
 * Hook para usar o contexto de alertas em qualquer componente
 * @returns {Object} Funções e estados do contexto de alertas
 */
export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert deve ser usado dentro de um AlertProvider');
  }
  return context;
}