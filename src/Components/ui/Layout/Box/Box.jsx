import React from 'react';
import PropTypes from 'prop-types';
import './Box.css';

/**
 * Componente Box para espaçamento e layout básico
 * Uma primitiva de layout simples para aplicar padding, margin e outros atributos
 */
const Box = ({
  children,
  component = 'div',
  padding = 'none',
  margin = 'none',
  width = 'auto',
  height = 'auto',
  display = 'block',
  flexDirection,
  justifyContent,
  alignItems,
  flexWrap,
  backgroundColor,
  className = '',
  ...props
}) => {
  const boxClasses = [
    'box',
    `box--padding-${padding}`,
    `box--margin-${margin}`,
    `box--width-${width}`,
    `box--height-${height}`,
    `box--display-${display}`,
    flexDirection ? `box--flex-direction-${flexDirection}` : '',
    justifyContent ? `box--justify-content-${justifyContent}` : '',
    alignItems ? `box--align-items-${alignItems}` : '',
    flexWrap ? `box--flex-wrap-${flexWrap}` : '',
    backgroundColor ? `box--bg-${backgroundColor}` : '',
    className
  ].filter(Boolean).join(' ');

  const Component = component;

  return (
    <Component className={boxClasses} {...props}>
      {children}
    </Component>
  );
};

Box.propTypes = {
  /** Conteúdo do box */
  children: PropTypes.node,
  /** Elemento HTML a ser renderizado */
  component: PropTypes.elementType,
  /** Padding interno */
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** Margin externo */
  margin: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** Largura do box */
  width: PropTypes.oneOf(['auto', 'full', '1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5']),
  /** Altura do box */
  height: PropTypes.oneOf(['auto', 'full', 'screen']),
  /** Propriedade display */
  display: PropTypes.oneOf(['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none']),
  /** Direção do flex (quando display é flex) */
  flexDirection: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
  /** Alinhamento horizontal flex */
  justifyContent: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']),
  /** Alinhamento vertical flex */
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  /** Wrap do flex */
  flexWrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
  /** Cor de fundo */
  backgroundColor: PropTypes.oneOf(['primary', 'secondary', 'transparent', 'white', 'error', 'success', 'warning']),
  /** Classes CSS adicionais */
  className: PropTypes.string
};

export default Box;