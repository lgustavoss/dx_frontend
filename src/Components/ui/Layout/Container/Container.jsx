import React from 'react';
import PropTypes from 'prop-types';
import './Container.css';

/**
 * Componente Container para limitar largura e centralizar conteúdo
 * Fornece controle consistente de largura máxima e padding
 */
const Container = ({
  children,
  fluid = false,
  centered = true,
  className = '',
  padding = 'medium',
  maxWidth = 'default',
  fullHeight = false,
  ...props
}) => {
  const containerClasses = [
    'container',
    fluid ? 'container--fluid' : '',
    centered ? 'container--centered' : '',
    `container--padding-${padding}`,
    `container--max-width-${maxWidth}`,
    fullHeight ? 'container--full-height' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  /** Conteúdo do container */
  children: PropTypes.node.isRequired,
  /** Se true, remove a largura máxima */
  fluid: PropTypes.bool,
  /** Se true, centraliza o container */
  centered: PropTypes.bool,
  /** Classes CSS adicionais */
  className: PropTypes.string,
  /** Tamanho do padding */
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /** Largura máxima do container */
  maxWidth: PropTypes.oneOf(['small', 'default', 'medium', 'large', 'xlarge']),
  /** Se true, ocupa 100% da altura disponível */
  fullHeight: PropTypes.bool
};

export default Container;