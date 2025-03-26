import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import './Pagination.css';

/**
 * Componente de paginação para tabelas e listas
 * Permite navegação entre páginas de dados
 */
const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  maxVisiblePages = 5,
  showItemsPerPage = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  showFirstLastButtons = true,
  showPageSizeSelector = false,
  showItemsCount = true,
  className = '',
  labels = {
    first: 'Primeira',
    previous: 'Anterior',
    next: 'Próxima',
    last: 'Última',
    itemsPerPage: 'Itens por página:',
    showing: 'Mostrando',
    of: 'de',
    items: 'itens'
  }
}) => {
  // Calcula o número total de páginas
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / itemsPerPage)), [totalItems, itemsPerPage]);
  
  // Ajusta a página atual se estiver fora dos limites
  const adjustedCurrentPage = useMemo(() => {
    return Math.min(Math.max(1, currentPage), totalPages);
  }, [currentPage, totalPages]);
  
  // Calcula o range de itens sendo exibidos
  const itemRange = useMemo(() => {
    const start = (adjustedCurrentPage - 1) * itemsPerPage + 1;
    const end = Math.min(adjustedCurrentPage * itemsPerPage, totalItems);
    return { start, end };
  }, [adjustedCurrentPage, itemsPerPage, totalItems]);
  
  // Determina quais números de página mostrar
  const pageNumbers = useMemo(() => {
    const pageArray = [];
    
    if (totalPages <= maxVisiblePages) {
      // Se o total de páginas é menor que o máximo visível, mostre todas
      for (let i = 1; i <= totalPages; i++) {
        pageArray.push(i);
      }
    } else {
      // Caso contrário, calcule quais números mostrar
      let startPage = Math.max(1, adjustedCurrentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Adicione a primeira página se estiver fora do range
      if (startPage > 1) {
        pageArray.push(1);
        if (startPage > 2) {
          pageArray.push('...');
        }
      }
      
      // Adicione as páginas intermediárias
      for (let i = startPage; i <= endPage; i++) {
        pageArray.push(i);
      }
      
      // Adicione a última página se estiver fora do range
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageArray.push('...');
        }
        pageArray.push(totalPages);
      }
    }
    
    return pageArray;
  }, [adjustedCurrentPage, totalPages, maxVisiblePages]);
  
  // Handler para mudar de página
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === adjustedCurrentPage) return;
    onPageChange(page);
  };
  
  // Handler para mudar itens por página
  const handleItemsPerPageChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (newSize && onItemsPerPageChange) {
      onItemsPerPageChange(newSize);
    }
  };
  
  // Se não houver itens, não renderize a paginação
  if (totalItems === 0) return null;
  
  return (
    <div className={`pagination ${className}`}>
      {/* Contagem de itens */}
      {showItemsCount && (
        <div className="pagination__count">
          {labels.showing} {itemRange.start}-{itemRange.end} {labels.of} {totalItems} {labels.items}
        </div>
      )}
      
      {/* Seletor de itens por página */}
      {showItemsPerPage && (
        <div className="pagination__items-per-page">
          <label htmlFor="itemsPerPage">{labels.itemsPerPage}</label>
          <select 
            id="itemsPerPage" 
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="pagination__select"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Controles de paginação */}
      <div className="pagination__controls">
        {/* Botão para primeira página */}
        {showFirstLastButtons && (
          <button
            className="pagination__button pagination__button--first"
            onClick={() => handlePageChange(1)}
            disabled={adjustedCurrentPage === 1}
            aria-label={labels.first}
            title={labels.first}
          >
            <FaAngleDoubleLeft />
          </button>
        )}
        
        {/* Botão para página anterior */}
        <button
          className="pagination__button pagination__button--prev"
          onClick={() => handlePageChange(adjustedCurrentPage - 1)}
          disabled={adjustedCurrentPage === 1}
          aria-label={labels.previous}
          title={labels.previous}
        >
          <FaChevronLeft />
        </button>
        
        {/* Botões numerados para páginas */}
        <div className="pagination__pages">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                className={`pagination__button pagination__button--number ${
                  page === adjustedCurrentPage ? 'pagination__button--active' : ''
                }`}
                onClick={() => handlePageChange(page)}
                disabled={page === adjustedCurrentPage}
                aria-current={page === adjustedCurrentPage ? 'page' : undefined}
                aria-label={`Página ${page}`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        {/* Botão para próxima página */}
        <button
          className="pagination__button pagination__button--next"
          onClick={() => handlePageChange(adjustedCurrentPage + 1)}
          disabled={adjustedCurrentPage === totalPages}
          aria-label={labels.next}
          title={labels.next}
        >
          <FaChevronRight />
        </button>
        
        {/* Botão para última página */}
        {showFirstLastButtons && (
          <button
            className="pagination__button pagination__button--last"
            onClick={() => handlePageChange(totalPages)}
            disabled={adjustedCurrentPage === totalPages}
            aria-label={labels.last}
            title={labels.last}
          >
            <FaAngleDoubleRight />
          </button>
        )}
      </div>
      
      {/* Seletor de tamanho de página (versão alternativa) */}
      {showPageSizeSelector && (
        <div className="pagination__page-size-selector">
          <label htmlFor="pageSizeSelector">{labels.itemsPerPage}</label>
          <select 
            id="pageSizeSelector" 
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="pagination__select"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func,
  maxVisiblePages: PropTypes.number,
  showItemsPerPage: PropTypes.bool,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  showFirstLastButtons: PropTypes.bool,
  showPageSizeSelector: PropTypes.bool,
  showItemsCount: PropTypes.bool,
  className: PropTypes.string,
  labels: PropTypes.shape({
    first: PropTypes.string,
    previous: PropTypes.string,
    next: PropTypes.string,
    last: PropTypes.string,
    itemsPerPage: PropTypes.string,
    showing: PropTypes.string,
    of: PropTypes.string,
    items: PropTypes.string
  })
};

export default Pagination;