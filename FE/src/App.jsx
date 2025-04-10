import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { isTokenValid } from './services/api'
import Dashboard from './components/dashboard/dashboard'
import Layout from './components/layout/Layout'
import { Provider } from 'react-redux';
import { store } from './components/store/store';



function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <Route path="logout" element={<Logout />} /> */}
        </Route>
      </Routes>
    </Provider>

    
  )
}

export default App