import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { UIProvider } from './ui/UIContext';
import { ClienteProvider } from './cliente/ClienteContext';
import { UsuarioProvider } from './usuario/UsuarioContext';
import { AlertProvider } from './alert/AlertContext';

export function AppProviders({ children }) {
  return (
    <AlertProvider>
      <Router>
        <AuthProvider>
          <UIProvider>
            <ClienteProvider>
              <UsuarioProvider>
                {children}
              </UsuarioProvider>
            </ClienteProvider>
          </UIProvider>
        </AuthProvider>
      </Router>
    </AlertProvider>
  );
}