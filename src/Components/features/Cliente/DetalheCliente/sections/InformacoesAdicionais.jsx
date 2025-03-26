import React from 'react';
import PropTypes from 'prop-types';

const InformacoesAdicionais = ({ cliente, getUserName }) => {
  return (
    <div className="detalhe-section">
      <h2>Informações Adicionais</h2>
      <div className="info-grid">
        <div className="info-item">
          <label>Data de Criação:</label>
          <span>{cliente.data_criacao ? new Date(cliente.data_criacao).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Criado por:</label>
          <span>{getUserName(cliente.criado_por)}</span>
        </div>
        {cliente.data_atualizacao ? (
          <>
            <div className="info-item">
              <label>Data de Atualização:</label>
              <span>{new Date(cliente.data_atualizacao).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Atualizado por:</label>
              <span>{getUserName(cliente.atualizado_por)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="info-item">
              <label>Data de Atualização:</label>
              <span>N/A</span>
            </div>
            <div className="info-item">
              <label>Atualizado por:</label>
              <span>N/A</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

InformacoesAdicionais.propTypes = {
  cliente: PropTypes.object.isRequired,
  getUserName: PropTypes.func.isRequired
};

export default InformacoesAdicionais;