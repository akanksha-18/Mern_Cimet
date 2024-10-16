import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');

    if (userRole !== 'doctor' && userRole !== 'super_admin') {
      navigate('/'); 
      return;
    }

    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:4000/api/appointments/doctor', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments', err);
        if (err.response && err.response.status === 403) {
          setError('Access denied. You are not allowed to view this information.');
        } else {
          setError('Unable to fetch appointments. Please try again later.');
        }
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`http://localhost:4000/api/appointments/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, status } : app
      ));
      alert('Appointment updated successfully!');
    } catch (err) {
      console.error('Error updating appointment', err);
      alert('Error updating appointment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: 'UTC'  
    };
    return date.toLocaleString('en-US', options);
  };

  const isDateExpired = (dateString) => {
    const appointmentDate = new Date(dateString);
    return appointmentDate < new Date(); 
  };

  return (
    
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Appointments</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="bg-white shadow-md rounded-lg p-4">
              <p><strong>Patient:</strong> {appointment.patient.name}</p>
              <p><strong>Slot:</strong> {formatDate(appointment.date)}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              <p><strong>Symptoms:</strong> {appointment.symptoms || 'No symptoms provided'}</p> {/* Display symptoms */}
              {appointment.status === 'pending' && !isDateExpired(appointment.date) && (
                <div className="mt-2">
                  <button 
                    onClick={() => handleStatusChange(appointment._id, 'accepted')}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleStatusChange(appointment._id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
              {isDateExpired(appointment.date) && (
                <p className="text-gray-500 mt-2">This appointment has expired.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No appointments found.</p>
      )}
    </div>
  );
}

export default ManageAppointments;



