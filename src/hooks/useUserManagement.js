import { useState, useEffect, useCallback } from 'react';
import { api } from '../axiosConfig';

export function useUserManagement() {
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Carregar dados do usuário atual do localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setCurrentUser(userData);
      // Adicionar o usuário local ao objeto usuarios
      setUsuarios(prev => ({
        ...prev,
        [userData.id]: userData
      }));
    }
  }, []);
  
  /**
   * Busca dados de vários usuários pelo ID
   */
  const fetchUsuarios = useCallback(async (userIds) => {
    if (!userIds || userIds.length === 0) return {};
    
    setLoading(true);
    const usersData = {};
    
    // Buscar primeiro no localStorage para evitar chamadas desnecessárias
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userIds.includes(userData.id)) {
      usersData[userData.id] = userData;
      // Remover o usuário local da lista para não buscá-lo novamente
      userIds = userIds.filter(id => id !== userData.id);
    }
    
    // Buscar os demais usuários na API
    for (const userId of userIds) {
      try {
        const userResponse = await api.get(`/usuario/users/${userId}/`);
        usersData[userId] = userResponse.data;
      } catch (userErr) {
        console.error(`Erro ao buscar usuário ${userId}:`, userErr);
        usersData[userId] = { 
          first_name: "Usuário não encontrado", 
          username: "N/A" 
        };
      }
      
      // Pequeno atraso entre chamadas para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setUsuarios(prevUsuarios => ({ ...prevUsuarios, ...usersData }));
    setLoading(false);
    return usersData;
  }, []);
  
  /**
   * Obtém o nome formatado do usuário
   */
  const getUserName = useCallback((userId) => {
    if (!userId) return 'N/A';
    
    // Primeiro verificamos no cache de usuários
    if (usuarios[userId]) {
      const user = usuarios[userId];
      const displayName = user.first_name || user.username;
      return `${displayName} (${user.username})`;
    }
    
    // Se for o usuário atual, pegamos do localStorage
    const currentUserData = JSON.parse(localStorage.getItem('user'));
    if (currentUserData && currentUserData.id === userId) {
      const displayName = currentUserData.first_name || currentUserData.username;
      return `${displayName} (${currentUserData.username})`;
    }
    
    return 'Usuário não encontrado';
  }, [usuarios]);
  
  return {
    usuarios,
    setUsuarios,
    loading,
    fetchUsuarios,
    getUserName,
    currentUser
  };
}