import React from 'react';
import PropTypes from 'prop-types';
import './ResponsiveGrid.css';

/**
 * Grid responsivo e configurável para organizar conteúdo em colunas
 * Abstrai os diversos padrões de grid do projeto em um único componente
 */
const ResponsiveGrid = ({
  children,
  columns = 'auto-fit',
  minWidth = 300,
  gap = 'medium',
  rowGap,
  columnGap,
  responsive = true,
  proportions = null,
  className = '',
  breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  responsiveConfig = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  },
  ...props
}) => {
  // Função para determinar as classes CSS do grid com base nas props
  const getGridClasses = () => {
    const classes = ['responsive-grid'];
    
    // Adicionar classes para variações
    if (gap) classes.push(`responsive-grid--gap-${gap}`);
    if (className) classes.push(className);
    
    return classes.join(' ');
  };
  
  // Função para gerar estilos inline do grid
  const getGridStyles = () => {
    const styles = {};
    
    // Configuração básica
    if (proportions) {
      // Para grid com proporções fixas (ex: 2fr 1fr 1fr)
      styles.gridTemplateColumns = proportions;
    } else if (columns === 'auto-fit' || columns === 'auto-fill') {
      // Para grid responsivo automático
      styles.gridTemplateColumns = `repeat(${columns}, minmax(${typeof minWidth === 'number' ? `${minWidth}px` : minWidth}, 1fr))`;
    } else if (typeof columns === 'number') {
      // Para número específico de colunas
      styles.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    } else {
      // Para definição personalizada (ex: "1fr 2fr")
      styles.gridTemplateColumns = columns;
    }
    
    // Gaps personalizados
    if (rowGap && columnGap) {
      styles.gap = undefined; // Remover gap geral se tiver específicos
      styles.rowGap = typeof rowGap === 'number' ? `${rowGap}px` : rowGap;
      styles.columnGap = typeof columnGap === 'number' ? `${columnGap}px` : columnGap;
    }
    
    // Gerar estilos responsivos para diferentes breakpoints
    if (responsive && !proportions) {
      const mediaQueries = Object.entries(breakpoints).map(([breakpoint, width]) => {
        const cols = responsiveConfig[breakpoint];
        if (cols) {
          return `
            @media (max-width: ${width}px) {
              .${getGridClasses().replace(/\s+/g, '.')} {
                grid-template-columns: repeat(${cols}, 1fr);
              }
            }
          `;
        }
        return '';
      }).filter(Boolean).join('\n');
      
      // Adicionar media queries ao documento se não existirem
      if (mediaQueries && typeof document !== 'undefined') {
        const styleId = 'responsive-grid-dynamic-styles';
        if (!document.getElementById(styleId)) {
          const styleElement = document.createElement('style');
          styleElement.id = styleId;
          styleElement.innerHTML = mediaQueries;
          document.head.appendChild(styleElement);
        }
      }
    }
    
    return styles;
  };
  
  return (
    <div 
      className={getGridClasses()} 
      style={getGridStyles()}
      {...props}
    >
      {children}
    </div>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.oneOf(['auto-fit', 'auto-fill'])
  ]),
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gap: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  rowGap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  columnGap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  responsive: PropTypes.bool,
  proportions: PropTypes.string,
  className: PropTypes.string,
  breakpoints: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  }),
  responsiveConfig: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  })
};

export default ResponsiveGrid;