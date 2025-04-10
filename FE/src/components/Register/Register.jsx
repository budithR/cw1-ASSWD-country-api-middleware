// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { registerUser } from '../../services/api'
// import './Register.css'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: ''
//   })
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)

//     try {
//       await registerUser(formData)
//       navigate('/login', { state: { registrationSuccess: true } })
//     } catch (err) {
//       setError(err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="register-container">
//       <h2>Register</h2>
//       {error && <div className="error-message">{error}</div>}
      
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <button 
//           type="submit" 
//           className="register-button"
//           disabled={isLoading}
//         >
//           {isLoading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default Register




import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/api'
import './Register.css'
import { useSelector } from 'react-redux'


const Register = () => {

  const theme = useSelector((state) => state.theme.value);
  if (theme) {
    console.log(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    let valid = true
    const newErrors = {
      username: '',
      email: '',
      password: ''
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
      valid = false
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
      valid = false
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
      await registerUser(formData)
      navigate('/login', { state: { registrationSuccess: true } })
    } catch (err) {
      setApiError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      {apiError && <div className="error-message">{apiError}</div>}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className={`form-group ${errors.username ? 'error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error-input' : ''}
          />
          {errors.username && <span className="field-error">{errors.username}</span>}
        </div>
        
        <div className={`form-group ${errors.email ? 'error' : ''}`}>
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
        
        <div className={`form-group ${errors.password ? 'error' : ''}`}>
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
          className="register-button"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="login-footer">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  )
}

export default Register