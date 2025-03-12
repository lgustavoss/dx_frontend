import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente que exibe um indicador de carregamento enquanto os dados do cliente são buscados
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isSidebarOpen - Indica se a sidebar está aberta
 * @returns {JSX.Element} Componente de carregamento
 */
const Loading = ({ isSidebarOpen }) => (
  <div className={`container-base container-detalhe-cliente ${isSidebarOpen ? 'sidebar-open' : ''}`}>
    <div className="loading-container">
      <h1>Carregando detalhes do cliente...</h1>
      <div className="loading-indicator">
        <div className="loading-spinner"></div>
      </div>
    </div>
  </div>
);

Loading.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired
};

export default Loading;