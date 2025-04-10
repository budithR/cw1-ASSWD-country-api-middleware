import { Link, useLocation } from 'react-router-dom';
import { getAuthToken } from '../../services/api';
import './Navbar.css';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { toggle } from '../store/themeSlice';


const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = !!getAuthToken();
  
  // const [theme, setTheme] = useState('light');

  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }


  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  //   document.documentElement.setAttribute('data-theme', newTheme);
  // };

  return (
    <nav className="navbar">
      <div className='navbar-content'>
        <h2 className='navbar-title'>CountryApi Dashboard</h2>
        <div className='buttons'>
          <button className='navbar-logout-button'>Logout</button>
          <button onClick={() => dispatch(toggle())} className="navbar-theme-button">
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;