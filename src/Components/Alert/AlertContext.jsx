import { createContext, useState, useContext } from 'react';

export const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, type = 'error', timeout = 15000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, timeout);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert }}>
      {children}
      <div className="global-alerts">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert ${alert.type}`}>
            {alert.message}
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);