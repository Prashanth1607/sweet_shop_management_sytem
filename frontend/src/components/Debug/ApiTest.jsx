import React, { useState } from 'react'
import api from '../../services/api'

const ApiTest = () => {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (endpoint) => {
    setLoading(true)
    try {
      const result = await api.get(endpoint)
      setResponse(JSON.stringify(result.data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Debug Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Test Endpoints</h2>
          <div className="space-y-2">
            <button
              onClick={() => testEndpoint('/sweets/')}
              className="btn-primary w-full"
              disabled={loading}
            >
              Test /sweets/
            </button>
            <button
              onClick={() => testEndpoint('/auth/me')}
              className="btn-secondary w-full"
              disabled={loading}
            >
              Test /auth/me
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Response</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
            {loading ? 'Loading...' : response || 'No response yet'}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ApiTest