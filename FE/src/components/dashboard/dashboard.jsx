import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthToken, getApiKeys, revokeApiKey, generateApiKey } from '../../services/api'
import './Dashboard.css'
import formatDateTime from '../../services/dateFoematter'

const Dashboard = () => {
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate()
  const message = {
    isDisplay: true,
    message: 'test message',
    type: 'success',
  }

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const keys = await getApiKeys()
      setApiKeys(keys)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check authentication first
    if (!getAuthToken()) {
      navigate('/login')
      return
    }
    fetchApiKeys()
  }, [navigate])

//   useEffect(() => {
//     const fetchData = async () => {
//       // Check authentication first
//       if (!getAuthToken()) {
//         navigate('/login')
//         return
//       }

//       try {
//         setLoading(true)
//         const keys = await getApiKeys()
//         setApiKeys(keys)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [navigate])

  const handleRevoke = async (keyId) => {
    try {
      await revokeApiKey(keyId)
      // Refresh the keys list after successful revocation
      await fetchApiKeys()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGenerate = async () => {
    try {
    //   setIsGenerating(true)
      await generateApiKey()
      // Refresh the keys list after generation
      await fetchApiKeys()
    } catch (err) {
      setError(err.message)
    } finally {
    //   setIsGenerating(false)
    } 
    }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authTokenExpiration')
    navigate('/login')
  }

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>API Keys Dashboard</h1>
        {/* <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
        <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button> */}
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        {apiKeys.length === 0 ? (
          <div className="no-keys-message">
            Currently you don't have any API keys created.
          </div>
        ) : (
          <table className="api-keys-table">
            <thead>
              <tr>
                <th>API Key</th>
                <th>Status</th>
                <th>Usage Count</th>
                <th>Created At</th>
                <th colSpan={2}>Last Used</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td>{key.key}</td>
                  <td>
                    <span className={`status-badge ${key.isActive ? 'active' : 'inactive'}`}>
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{key.usageCount}</td>
                  <td>{formatDateTime(key.createdAt)}</td>
                  <td>{key.lastUsed || 'Never'}</td>
                  <td>{key.isActive && <button className='revoke' onClick={() => handleRevoke(key.id)}>Revoke</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className='table-bottom-buttons'>
            <button className='button-with-icon' onClick={() => handleGenerate()}>
              <i className='bx bx-plus'></i>
              <span>Create New Key</span>
            </button>
            
            {
              message.isDisplay && (
                <div className={`message-box ${message.type ? 'message-success' : 'message-error'}`}>
                  {message.message}
            </div>
              )
            }
            <button className='button-with-icon' >
            <i class='bx bx-right-arrow-circle'></i>
            <span>Go To API Documentation</span>
            </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard