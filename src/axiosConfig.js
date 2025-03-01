import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Adiciona um interceptor de resposta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redireciona para a tela de login se o token expirar
      window.location = '/';
    }
    return Promise.reject(error);
  }
);

// Função para verificar se o token é válido
const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location = '/';
    return;
  }

  try {
    await api.post('/token/verify/', { token });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.location = '/';
    }
  }
};

// Função para renovar o token
const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) {
    window.location = '/';
    return;
  }

  try {
    const response = await api.post('/token/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('token', access);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.location = '/';
    }
  }
};

// Variável para armazenar o temporizador de inatividade
let inactivityTimeout;

// Função para reiniciar o temporizador de inatividade
const resetInactivityTimeout = () => {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    window.location = '/';
  }, 5 * 60 * 1000); // Redireciona para a tela de login após 5 minutos de inatividade
};

// Adiciona eventos de escuta para detectar a atividade do usuário na aplicação
const addActivityListeners = () => {
  ['mousemove', 'keydown', 'click', 'input'].forEach(event => {
    document.addEventListener(event, resetInactivityTimeout);
  });
};

// Configura um intervalo para verificar e renovar o token periodicamente
setInterval(async () => {
  await verifyToken();
  await refreshToken();
}, 15 * 60 * 1000); // Verifica e renova o token a cada 15 minutos

export { api, addActivityListeners };