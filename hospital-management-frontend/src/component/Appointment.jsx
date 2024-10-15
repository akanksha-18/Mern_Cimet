import  { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/users?role=doctor');
        if (res.data.length === 0) {
          setError('No doctors found');
        } else {
          setDoctors(res.data);
        }
      } catch (err) {
        console.error('Error fetching doctors', err);
        setError('Error fetching doctors. Please try again later.');
      }
    };

    fetchDoctors();
  }, []);

  const bookAppointment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setError('You need to log in to book an appointment.');
      return;
    }

    if (!doctorId || !selectedDate) {
      setError('Please select a doctor and a valid date/time before booking.');
      return;
    }

    try {
      
      const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);

      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('http://localhost:4000/api/appointments/book', {
        doctorId: doctorId,
        slot: utcDate.toISOString(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Appointment booked successfully!');
      setError('');
      setDoctorId('');
      setSelectedDate(null);
    } catch (err) {
      console.error('Error booking appointment:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred while booking the appointment.');
      }
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={bookAppointment} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Book Appointment</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {doctors.length > 0 ? (
          <>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="border p-2 w-full mb-4"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select Date and Time"
              className="border p-2 w-full mb-4"
              minDate={new Date()}
              filterTime={(time) => {
                const currentDate = new Date();
                const selectedDate = new Date(time);
                return currentDate.getTime() < selectedDate.getTime();
              }}
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 w-full hover:bg-blue-600 transition-colors">Book</button>
          </>
        ) : (
          <p>No doctors available at the moment.</p>
        )}
      </form>
    </div>
  );
}

export default Appointment;