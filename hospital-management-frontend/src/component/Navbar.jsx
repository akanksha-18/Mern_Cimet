/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setUserName(JSON.parse(user).name); // Safely parse the user data
      } catch (e) {
        console.error("Error parsing user data:", e); // Handle JSON parsing errors
      }
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
