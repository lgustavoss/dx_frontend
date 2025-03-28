import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../../axiosConfig';
import { useAlert } from '../alert/AlertContext';

// Criar o contexto
const ClienteContext = createContext();

// Criar o provedor
export function ClienteProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const { addAlert } = useAlert();

  // Carregar lista de clientes
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/cliente/clientes/');
      setClientes(response.data.results || []);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      addAlert('Erro ao carregar clientes. Tente novamente mais tarde.', 'error');
      setLoading(false);
    }
  }, [addAlert]);

  // Carregar um cliente específico
  const fetchClienteById = useCallback(async (id) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const response = await api.get(`/cliente/clientes/${id}/`);
      setClienteAtual(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar cliente:', err);
      addAlert('Erro ao carregar detalhes do cliente.', 'error');
      setLoading(false);
      return null;
    }
  }, [addAlert]);

  // Atualizar um cliente
  const updateCliente = useCallback(async (id, data) => {
    try {
      const response = await api.patch(`/cliente/clientes/${id}/`, data);
      setClienteAtual(prev => ({...prev, ...data}));
      
      // Também atualizar na lista se existir
      setClientes(prev => prev.map(cliente => 
        cliente.id === id ? {...cliente, ...data} : cliente
      ));
      
      addAlert('Cliente atualizado com sucesso!', 'success');
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      addAlert('Erro ao atualizar cliente.', 'error');
      return null;
    }
  }, [addAlert]);

  // Criar um novo cliente
  const createCliente = useCallback(async (data) => {
    try {
      const response = await api.post('/cliente/clientes/', data);
      addAlert('Cliente cadastrado com sucesso!', 'success');
      return response.data;
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err);
      addAlert('Erro ao cadastrar cliente.', 'error');
      return null;
    }
  }, [addAlert]);

  // Carregar UFs
  const fetchUFs = useCallback(async () => {
    try {
      const response = await api.get('/cliente/consulta/ufs/');
      setUfs(response.data);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar UFs:', err);
      addAlert('Erro ao carregar lista de estados.', 'error');
      return [];
    }
  }, [addAlert]);

  // Carregar cidades por UF
  const fetchCidadesByUF = useCallback(async (uf) => {
    try {
      const response = await api.get(`/cliente/consulta/municipios/${uf}/`);
      setCidades(response.data);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar municípios:', err);
      addAlert('Erro ao carregar lista de cidades.', 'error');
      return [];
    }
  }, [addAlert]);

  // Deletar um cliente
  const deleteCliente = useCallback(async (id) => {
    try {
      await api.delete(`/cliente/clientes/${id}/`);
      
      // Remover da lista após a exclusão
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
      
      addAlert('Cliente excluído com sucesso!', 'success');
      return true;
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      addAlert('Erro ao excluir cliente.', 'error');
      return false;
    }
  }, [addAlert]);

  // Busca avançada de clientes
  const searchClientes = useCallback(async (searchParams) => {
    setLoading(true);
    try {
      const response = await api.get('/cliente/clientes/', { 
        params: searchParams 
      });
      setClientes(response.data.results || []);
      setLoading(false);
      return response.data.results || [];
    } catch (err) {
      console.error('Erro na busca de clientes:', err);
      addAlert('Erro ao buscar clientes. Tente novamente.', 'error');
      setLoading(false);
      return [];
    }
  }, [addAlert]);

  const value = {
    clientes,
    clienteAtual,
    loading,
    ufs,
    cidades,
    fetchClientes,
    fetchClienteById,
    updateCliente,
    createCliente,
    deleteCliente,
    searchClientes,
    fetchUFs,
    fetchCidadesByUF
  };

  return (
    <ClienteContext.Provider value={value}>
      {children}
    </ClienteContext.Provider>
  );
}

// Hook para usar o contexto
export function useCliente() {
  const context = useContext(ClienteContext);
  if (context === undefined) {
    throw new Error('useCliente deve ser usado dentro de um ClienteProvider');
  }
  return context;
}