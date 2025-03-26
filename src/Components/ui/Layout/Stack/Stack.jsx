import React from 'react';
import PropTypes from 'prop-types';
import './Stack.css';

/**
 * Componente Stack para empilhar elementos com espaçamento consistente
 */
const Stack = ({
  children,
  direction = 'column',
  spacing = 'medium',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  wrap = 'nowrap',
  divider,
  className = '',
  ...props
}) => {
  const stackClasses = [
    'stack',
    `stack--direction-${direction}`,
    `stack--spacing-${spacing}`,
    `stack--justify-${justifyContent}`,
    `stack--align-${alignItems}`,
    `stack--wrap-${wrap}`,
    className
  ].filter(Boolean).join(' ');

  // Se tiver divider, renderiza com dividers entre os elementos
  const childrenWithDividers = () => {
    if (!divider || !children || !React.Children.count(children)) {
      return children;
    }

    const arrayChildren = React.Children.toArray(children).filter(Boolean);
    
    return arrayChildren.reduce((result, child, index) => {
      const key = `${index}-${child.key || ''}`;
      
      if (index !== 0) {
        const dividerElement = React.cloneElement(divider, {
          key: `divider-${key}`,
          className: `stack__divider ${divider.props.className || ''}`
        });
        
        result.push(dividerElement);
      }
      
      result.push(React.cloneElement(child, { key }));
      return result;
    }, []);
  };

  return (
    <div className={stackClasses} {...props}>
      {divider ? childrenWithDividers() : children}
    </div>
  );
};

Stack.propTypes = {
  /** Conteúdo da stack */
  children: PropTypes.node,
  /** Direção do empilhamento */
  direction: PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse']),
  /** Espaçamento entre elementos */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'medium', 'lg', 'xl']),
  /** Alinhamento horizontal */
  justifyContent: PropTypes.oneOf([
    'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'
  ]),
  /** Alinhamento vertical */
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  /** Comportamento de quebra de linha */
  wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
  /** Elemento divisor a ser inserido entre itens */
  divider: PropTypes.node,
  /** Classes CSS adicionais */
  className: PropTypes.string
};

export default Stack;