import api from './api'

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/users/me')
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}