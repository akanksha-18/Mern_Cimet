// import  { useState } from 'react';
// import axios from 'axios';

// function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:4000/api/users/register', { 
//         name, 
//         email, 
//         password, 
//         role: 'patient', 
//       });
//       alert('Registered successfully!');
//     } catch (err) {
//       alert('Error: ' + err.response.data.error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
//         <h2 className="text-2xl mb-4">Register</h2>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 w-full mb-4"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 w-full mb-4"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 w-full mb-4"
//         />
        
//         <button type="submit" className="bg-blue-500 text-white py-2 px-4 w-full">Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;

import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
    return re.test(String(email).toLowerCase());
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/; 
    return regex.test(name) && name.trim().length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    toast.dismiss();

   
    if (!validateName(name)) {
      toast.error('Please enter a valid name.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address ending with .com or .in.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/users/register', { 
        name, 
        email, 
        password, 
        role: 'patient', 
      });
      
     
      setName('');
      setEmail('');
      setPassword('');
      
      toast.success('Registered successfully! Redirecting to login...');
      
      setTimeout(() => {
        window.location.href = '/login'; 
      }, 2000);
    } catch (err) {
     
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 w-full">Register</button>
      </form>
    </div>
  );
}

export default Register;
