import axios from 'axios';

const API_URL = 'http://localhost:5000/auth/';

const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
};

const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await axios.post(`${API_URL}refresh`, { refreshToken });
    if (response.data.accessToken) {
      storeTokens(response.data.accessToken, refreshToken);
      return true;
    }
  } catch (err) {
    console.error('Error refreshing token:', err);
    removeTokens();
    window.location.href = '/login';
    return false;
  }
};

const isAuthenticated = async () => {
  const accessToken = getAccessToken();
  if (!accessToken) return false;

  if (isTokenExpired(accessToken)) {
    return await refreshAuthToken();
  }

  return true;
};

export { storeTokens, getAccessToken, removeTokens, isAuthenticated };
