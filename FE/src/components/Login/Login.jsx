import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginUser, storeAuthToken } from '../../services/api'
import './Login.css'
import { useSelector } from 'react-redux'

const Login = () => {

  const theme = useSelector((state) => state.theme.value);
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const registrationSuccess = location.state?.registrationSuccess

  const validateForm = () => {
    let valid = true
    const newErrors = {
      email: '',
      password: ''
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
      valid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { token, user } = await loginUser(formData)
      await storeAuthToken(token)
      setTimeout(() => navigate('/dashboard'), 1000)
      // navigate('/dashboard')
    } catch (err) {
      setApiError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {registrationSuccess && (
        <div className="success-message">
          Registration successful! Please log in.
        </div>
      )}
      {apiError && <div className="error-message">{apiError}</div>}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className={`form-group-login ${errors.email ? 'error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        
        <div className={`form-group-login ${errors.password ? 'error' : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="login-footer">
        Don't have an account? <a href="/register">Register</a>
      </div>
    </div>
  )
}

export default Login