import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Auth functions
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    throw error.response?.data?.message || 'Login failed'
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData)
    return response.data
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed'
  }
}

// Helper function to store token with expiration
// export const storeAuthToken = (token) => {
//   const now = new Date()
//   const expiration = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
//   localStorage.setItem('authToken', token)
//   localStorage.setItem('authTokenExpiration', expiration.toISOString())
// }

export const storeAuthToken = async (token) => {
  try {
    const now = new Date();
    const expiration = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', expiration.toISOString());
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error('Failed to store auth token'));
  }
};

// Helper function to check if token is still valid
export const isTokenValid = () => {
  const expiration = localStorage.getItem('authTokenExpiration')
  if (!expiration) return false
  
  return new Date(expiration) > new Date()
}

// Helper function to get current token
export const getAuthToken = () => {
  if (!isTokenValid()) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authTokenExpiration')
    return null
  }
  return localStorage.getItem('authToken')
}

// Get key related to logged user
export const getApiKeys = async () => {
    try {
      const response = await API.get('/keys')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch API keys'
    }
  }


// Revoke API
export const revokeApiKey = async (keyId) => {
    try {
      const response = await API.put(`/keys/revoke/${keyId}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to revoke API key'
    }
}

// Generate API key
export const generateApiKey = async () => {
    try {
      const response = await API.post('/keys/generate')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to generate API key'
    }
  }

// Add auth token to requests if available
API.interceptors.request.use(config => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})