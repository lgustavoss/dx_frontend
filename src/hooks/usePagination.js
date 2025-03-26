import { useState, useCallback, useMemo } from 'react';

/**
 * Hook para gerenciar o estado de paginação
 * 
 * @param {Object} options - Opções de configuração
 * @param {number} options.initialPage - Página inicial (padrão: 1)
 * @param {number} options.initialItemsPerPage - Itens por página inicial (padrão: 10)
 * @param {Array} options.data - Array de dados a ser paginado
 * @param {Function} options.onPageChange - Callback quando a página muda
 * @param {boolean} options.serverSide - Se true, não pagina os dados localmente
 * @returns {Object} Estado e funções para gerenciar paginação
 */
export function usePagination({
  initialPage = 1,
  initialItemsPerPage = 10,
  data = [],
  onPageChange = null,
  serverSide = false
} = {}) {
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  
  // Total de itens
  const totalItems = useMemo(() => data.length, [data]);
  
  // Total de páginas
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems, itemsPerPage]
  );
  
  // Ajustar página atual se necessário
  const adjustPage = useCallback(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);
  
  // Atualizar a página se o total de páginas mudar
  useMemo(() => {
    adjustPage();
  }, [totalPages, adjustPage]);
  
  // Mudar para uma página específica
  const goToPage = useCallback((page) => {
    const pageNumber = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(pageNumber);
    
    if (onPageChange) {
      onPageChange(pageNumber, itemsPerPage);
    }
  }, [totalPages, itemsPerPage, onPageChange]);
  
  // Ir para a próxima página
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);
  
  // Ir para a página anterior
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);
  
  // Ir para a primeira página
  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);
  
  // Ir para a última página
  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);
  
  // Mudar o número de itens por página
  const changeItemsPerPage = useCallback((newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset para a primeira página
    
    if (onPageChange) {
      onPageChange(1, newSize);
    }
  }, [onPageChange]);
  
  // Paginação de dados (para uso no cliente)
  const paginatedData = useMemo(() => {
    if (serverSide || !data.length) return data;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage, serverSide]);
  
  // Índices de início e fim da página atual
  const pageIndices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { start, end };
  }, [currentPage, itemsPerPage, totalItems]);
  
  return {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changeItemsPerPage,
    paginatedData,
    pageIndices
  };
}