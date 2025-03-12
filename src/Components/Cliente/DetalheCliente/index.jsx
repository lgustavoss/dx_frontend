/**
 * Index de exportação para os componentes e seções do DetalheCliente
 * Centraliza todas as importações para facilitar o uso dos componentes
 */

// Componentes
import EditableField from './components/EditableField';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import ConfirmationModal from './components/ConfirmationModal';

// Seções
import Endereco from './sections/Endereco';
import InformacoesEmpresa from './sections/InformacoesEmpresa';
import InformacoesAdicionais from './sections/InformacoesAdicionais';
import Responsavel from './sections/Responsavel';

// Estilos
import './DetalheCliente.css';

// Export individual dos componentes
export {
    // Componentes
    EditableField,
    Loading,
    NotFound,
    ConfirmationModal,
    
    // Seções
    Endereco,
    InformacoesEmpresa,
    InformacoesAdicionais,
    Responsavel
};

/**
 * Exportação padrão do componente DetalheCliente
 * Este arquivo facilita os imports no resto da aplicação,
 * seguindo o padrão de organização de componentes React
 */
export { default } from './DetalheCliente';