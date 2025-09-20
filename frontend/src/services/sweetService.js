import api from './api'

export const sweetService = {
  async getSweets(params = {}) {
    const response = await api.get('/sweets/', { params })
    return response.data
  },

  async searchSweets(searchParams) {
    const response = await api.get('/sweets/search', { params: searchParams })
    return response.data
  },

  async getSweetById(id) {
    const response = await api.get(`/sweets/${id}`)
    return response.data
  },

  async createSweet(sweetData) {
    const response = await api.post('/sweets/', sweetData)
    return response.data
  },

  async updateSweet(id, sweetData) {
    const response = await api.put(`/sweets/${id}`, sweetData)
    return response.data
  },

  async deleteSweet(id) {
    const response = await api.delete(`/sweets/${id}`)
    return response.data
  },

  async purchaseSweet(id, quantity = 1) {
    const response = await api.post(`/sweets/${id}/purchase`, { 
      sweet_id: id, 
      quantity 
    })
    return response.data
  },

  async restockSweet(id, quantity) {
    const response = await api.post(`/sweets/${id}/restock`, null, {
      params: { quantity }
    })
    return response.data
  }
}