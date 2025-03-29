import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { api } from '../../axiosConfig';
import { useAlert } from '../alert/AlertContext';

// Criar o contexto
const UsuarioContext = createContext();

// Criar o provedor
export function UsuarioProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addAlert } = useAlert();

  // Carregar lista de usuários
  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuario/users/');
      setUsuarios(response.data.results || []);
      setLoading(false);
      return response.data.results || [];
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      addAlert('Erro ao carregar usuários. Tente novamente mais tarde.', 'error');
      setLoading(false);
      return [];
    }
  }, [addAlert]);

  // Carregar um usuário específico
  const fetchUsuarioById = useCallback(async (id) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const response = await api.get(`/usuario/users/${id}/`);
      setUsuarioAtual(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      addAlert('Erro ao carregar detalhes do usuário.', 'error');
      setLoading(false);
      return null;
    }
  }, [addAlert]);

  // Atualizar um usuário
  const updateUsuario = useCallback(async (id, data) => {
    try {
      const response = await api.patch(`/usuario/users/${id}/`, data);
      setUsuarioAtual(prev => ({...prev, ...data}));
      
      // Também atualizar na lista se existir
      setUsuarios(prev => prev.map(usuario => 
        usuario.id === id ? {...usuario, ...data} : usuario
      ));
      
      addAlert('Usuário atualizado com sucesso!', 'success');
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      addAlert('Erro ao atualizar usuário.', 'error');
      return null;
    }
  }, [addAlert]);

  // Criar um novo usuário
  const createUsuario = useCallback(async (data) => {
    try {
      const response = await api.post('/usuario/users/', data);
      addAlert('Usuário cadastrado com sucesso!', 'success');
      return response.data;
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      addAlert('Erro ao cadastrar usuário.', 'error');
      return null;
    }
  }, [addAlert]);

  // Deletar um usuário
  const deleteUsuario = useCallback(async (id) => {
    try {
      await api.delete(`/usuario/users/${id}/`);
      
      // Remover da lista após a exclusão
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
      
      addAlert('Usuário excluído com sucesso!', 'success');
      return true;
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      addAlert('Erro ao excluir usuário.', 'error');
      return false;
    }
  }, [addAlert]);

  // Busca avançada de usuários
  const searchUsuarios = useCallback(async (searchParams) => {
    setLoading(true);
    try {
      const response = await api.get('/usuario/users/', { params: searchParams });
      setUsuarios(response.data.results || []);
      setLoading(false);
      return response.data.results || [];
    } catch (err) {
      console.error('Erro na busca de usuários:', err);
      addAlert('Erro ao buscar usuários. Tente novamente.', 'error');
      setLoading(false);
      return [];
    }
  }, [addAlert]);

  // Obter dados do usuário logado
  const getCurrentUser = useCallback(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData;
  }, []);

  // Obter nome formatado do usuário
  const getUserName = useCallback((id) => {
    if (!id) return 'N/A';
    
    // Verificar no array de usuários
    const usuarioEncontrado = usuarios.find(user => user.id === id);
    
    if (usuarioEncontrado) {
      const displayName = usuarioEncontrado.first_name || usuarioEncontrado.username;
      return `${displayName} (${usuarioEncontrado.username})`;
    }
    
    // Se não encontrar nos usuários carregados, tenta no localStorage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === id) {
      const displayName = currentUser.first_name || currentUser.username;
      return `${displayName} (${currentUser.username})`;
    }
    
    return 'Usuário não encontrado';
  }, [usuarios, getCurrentUser]);

  // Usar useMemo para otimizar o objeto de contexto
  const value = useMemo(() => ({
    usuarios,
    usuarioAtual,
    loading,
    fetchUsuarios,
    fetchUsuarioById,
    updateUsuario,
    createUsuario,
    deleteUsuario,
    searchUsuarios,
    getUserName,
    getCurrentUser
  }), [
    usuarios, 
    usuarioAtual, 
    loading, 
    fetchUsuarios, 
    fetchUsuarioById, 
    updateUsuario, 
    createUsuario, 
    deleteUsuario, 
    searchUsuarios, 
    getUserName,
    getCurrentUser
  ]);

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  );
}

// Hook para usar o contexto
export function useUsuario() {
  const context = useContext(UsuarioContext);
  if (context === undefined) {
    throw new Error('useUsuario deve ser usado dentro de um UsuarioProvider');
  }
  return context;
}