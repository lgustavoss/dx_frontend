import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Variável para armazenar o temporizador de inatividade
let inactivityTimeout;

// Variável para controlar o processo de refresh do token
let isRefreshing = false;
let failedQueue = [];

// Função para processar a fila de requisições após o refresh do token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Função para reiniciar o temporizador de inatividade
const resetInactivityTimeout = () => {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    localStorage.clear();
    window.location = '/';
  }, 5 * 60 * 1000); // Redireciona para a tela de login após 5 minutos de inatividade
};

// Função para renovar o token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      throw new Error('No refresh token');
    }

    const response = await axios.post('http://127.0.0.1:8000/token/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('token', access);
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.clear();
    window.location = '/';
    return Promise.reject(error);
  }
};

// Adiciona um interceptor para as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Adiciona um interceptor para as respostas
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Se receber um 401 e não estiver tentando refresh já
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está atualizando o token, coloca a requisição na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenta renovar o token
        const newToken = await refreshToken();
        processQueue(null, newToken);
        
        // Atualiza o cabeçalho da requisição original e reenvio
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Reset o timeout de inatividade já que o usuário está ativo
        resetInactivityTimeout();
        
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Adicionar interceptor para logging detalhado (só para debug)
api.interceptors.request.use(
  config => {
    console.log('Requisição sendo enviada:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    // Garantir que Content-Type esteja corretamente definido para requisições PATCH
    if (config.method === 'patch' && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Adiciona eventos de escuta para detectar a atividade do usuário na aplicação
const addActivityListeners = () => {
  // Primeira inicialização do timeout
  resetInactivityTimeout();
  
  // Remove listeners anteriores para evitar duplicação
  ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(event => {
    document.removeEventListener(event, resetInactivityTimeout);
    document.addEventListener(event, resetInactivityTimeout);
  });
};

export { api, addActivityListeners };