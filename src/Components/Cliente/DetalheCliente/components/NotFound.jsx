import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft } from 'react-icons/fa';

/**
 * Componente para exibir mensagem quando um cliente não é encontrado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isSidebarOpen - Estado que indica se a sidebar está aberta
 * @param {Function} props.navigate - Função de navegação para retornar à listagem
 * @returns {JSX.Element} Componente de cliente não encontrado
 */
const NotFound = ({ isSidebarOpen, navigate }) => (
  <div className={`container-base container-detalhe-cliente ${isSidebarOpen ? 'sidebar-open' : ''}`}>
    <h1>Cliente não encontrado</h1>
    <p>O cliente solicitado não existe ou foi removido da base de dados.</p>
    <div className="button-container">
      <button 
        className="button-voltar" 
        onClick={() => navigate('/clientes')}
        type="button"
      >
        <FaArrowLeft /> Voltar para Listagem
      </button>
    </div>
  </div>
);

NotFound.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired
};

export default NotFound;