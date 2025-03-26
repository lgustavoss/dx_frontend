import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

/**
 * Componente Table reutilizável para exibição de dados em formato tabular
 * Extraído dos padrões usados em ListarCliente.jsx e ListarUsuario.jsx
 */
const Table = ({
  columns,
  data,
  loading = false,
  loadingMessage = 'Carregando...',
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  keyField = 'id',
  striped = true,
  bordered = true,
  className = '',
  compact = false,
  responsive = true,
  hover = true,
  fixedLayout = true,
  withPagination = false,
  paginationProps = {},
  ...props
}) => {
  // Verifica se há dados
  const hasData = data && data.length > 0;
  
  // Determina as classes CSS com base nas props
  const getTableClasses = () => {
    const classes = ['ui-table'];
    
    if (striped) classes.push('ui-table--striped');
    if (bordered) classes.push('ui-table--bordered');
    if (compact) classes.push('ui-table--compact');
    if (responsive) classes.push('ui-table--responsive');
    if (hover) classes.push('ui-table--hover');
    if (fixedLayout) classes.push('ui-table--fixed');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };
  
  // Renderiza o conteúdo da tabela com base no estado atual
  const renderTableContent = () => {
    if (loading) {
      return (
        <tr className="ui-table__loading-row">
          <td colSpan={columns.length} className="ui-table__loading-cell">
            <div className="ui-table__loading-message">{loadingMessage}</div>
          </td>
        </tr>
      );
    }
    
    if (!hasData) {
      return (
        <tr className="ui-table__empty-row">
          <td colSpan={columns.length} className="ui-table__empty-cell">
            <div className="ui-table__empty-message">{emptyMessage}</div>
          </td>
        </tr>
      );
    }
    
    return data.map((row, rowIndex) => (
      <tr 
        key={row[keyField] || rowIndex}
        className="ui-table__row"
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        style={onRowClick ? { cursor: 'pointer' } : undefined}
      >
        {columns.map((column, colIndex) => (
          <td 
            key={`${row[keyField] || rowIndex}-${column.key || colIndex}`}
            className={`ui-table__cell ${column.className || ''}`}
            style={column.width ? { width: column.width } : {}}
          >
            {column.render ? column.render(row, rowIndex) : row[column.key]}
          </td>
        ))}
      </tr>
    ));
  };
  
  // Container principal com responsividade condicional
  const TableContainer = responsive ? 'div' : React.Fragment;
  const containerProps = responsive ? { className: 'ui-table-responsive' } : {};
  
  return (
    <TableContainer {...containerProps}>
      <table className={getTableClasses()} {...props}>
        <thead className="ui-table__header">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={column.key || index}
                className={`ui-table__header-cell ${column.className || ''}`}
                style={column.width ? { width: column.width } : {}}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="ui-table__body">
          {renderTableContent()}
        </tbody>
      </table>
      
      {withPagination && hasData && !loading && (
        <div className="ui-table-pagination">
          {/* Futura implementação de paginação */}
          {/* <Pagination {...paginationProps} /> */}
        </div>
      )}
    </TableContainer>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.node.isRequired,
      render: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      className: PropTypes.string
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.node,
  emptyMessage: PropTypes.node,
  onRowClick: PropTypes.func,
  keyField: PropTypes.string,
  striped: PropTypes.bool,
  bordered: PropTypes.bool,
  className: PropTypes.string,
  compact: PropTypes.bool,
  responsive: PropTypes.bool,
  hover: PropTypes.bool,
  fixedLayout: PropTypes.bool,
  withPagination: PropTypes.bool,
  paginationProps: PropTypes.object
};

export default Table;