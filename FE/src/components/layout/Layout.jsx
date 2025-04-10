import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;