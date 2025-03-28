import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, addActivityListeners } from '../../axiosConfig';

// Criar o contexto
const AuthContext = createContext();

// Criar o provedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Carregar usuário dos dados salvos no localStorage
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);

  // Função para login
  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);
      
      // Ativar monitoramento de atividade do usuário
      addActivityListeners();
      
      // Buscar dados do usuário
      const userResponse = await api.get('/me/', {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      
      const userData = userResponse.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Erro ao fazer login' 
      };
    }
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // Função para atualizar dados do usuário
  const updateUserData = async (userId, updatedData) => {
    try {
      const response = await api.patch(`/usuario/users/${userId}/`, updatedData);
      
      // Atualiza o usuário no estado e no localStorage
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Erro ao atualizar dados do usuário'
      };
    }
  };

  // Valor do contexto que será disponibilizado
  const value = {
    user,
    loading,
    token,
    login,
    logout,
    updateUserData,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}