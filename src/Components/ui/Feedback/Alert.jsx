import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAlert as useAlertContext } from '../../../contexts/alert/AlertContext';

/**
 * Componente de alerta que usa o novo sistema de contextos
 * Este é um wrapper para manter compatibilidade com o código existente
 * @param {Object} props - Propriedades do componente
 * @param {string} props.message - Mensagem a ser exibida
 * @param {string} props.type - Tipo do alerta (success, error, info, warning)
 * @param {number} props.timeout - Tempo para o alerta desaparecer (ms)
 * @returns {null} - Não renderiza nada visualmente
 */
const Alert = ({ message, type, timeout }) => {
  const { addAlert } = useAlertContext();
  
  useEffect(() => {
    if (message) {
      // Adiciona o alerta usando o novo sistema de contextos
      addAlert(message, type, timeout);
    }
    // Não incluímos addAlert na lista de dependências para evitar loops infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, type, timeout]);
  
  // Não renderiza nada, pois os alertas são renderizados pelo AlertProvider
  return null;
};

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  timeout: PropTypes.number
};

Alert.defaultProps = {
  message: '',
  type: 'info',
  timeout: 5000
};

export default Alert;