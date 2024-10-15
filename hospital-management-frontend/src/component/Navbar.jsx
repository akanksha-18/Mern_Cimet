/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
    }
  }, [isLoggedIn]); 

  const handleUserLogout = () => {
    handleLogout(); 
    navigate('/login'); 
  };

  return (
    <nav className="p-4 bg-blue-500 text-white">
      <ul className="flex justify-around">
        <li>
          <Link to="/appointment">Appointment</Link>
        </li>
        <li>
          <Link to="/my-appointments">My Appointment</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <span className="mr-2">{userName}</span> 
              <button onClick={handleUserLogout} className="bg-red-500 text-white py-1 px-3 rounded">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/manage-appointments">Manage Appointments</Link>
        </li>
        <li>
          <Link to="/Admin-Dashboard">Admin Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
