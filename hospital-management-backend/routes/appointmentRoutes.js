const express = require('express');
const Appointment = require('../models/Appointment');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/doctor', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'name');
        
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


router.post('/book', authenticate, async (req, res) => {
    try {
        const { doctorId, slot } = req.body;
        const patientId = req.user.id;

        const appointmentDate = new Date(slot);

        // Check if there is already an appointment for the same doctor and slot
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date: appointmentDate.toISOString(),
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This slot is already booked.' });
        }

        // If no conflict, create new appointment
        const newAppointment = new Appointment({
            doctor: doctorId,
            patient: patientId,
            date: appointmentDate.toISOString(),
            status: 'pending'
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/appointments/patient', authenticate, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor')
            .populate('patient');
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.get('/appointments/doctor', authenticate, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('doctor')
            .populate('patient');
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.patch('/:id', authenticate, async (req, res) => {
    const { status } = req.body;

    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = status;  
        await appointment.save();
        res.json({ message: 'Appointment status updated', appointment });
    } catch (err) {
        console.error('Error updating appointment:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.get('/available', authenticate, async (req, res) => {
    const { doctorId, date } = req.query;

    try {
        const appointments = await Appointment.find({
            doctor: doctorId,
            date: {
                $gte: new Date(date),
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
            }
        });

        const allSlots = [];
        for (let hour = 9; hour < 17; hour++) {
            for (let min = 0; min < 60; min += 15) {
                allSlots.push(new Date(date).setHours(hour, min, 0, 0));
            }
        }

        const bookedSlots = appointments.map(app => new Date(app.date).getTime());
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        res.json(availableSlots);
    } catch (err) {
        console.error('Error fetching available slots:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.get('/patient', authenticate, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'name specialization') 
            .populate('patient', 'name');
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;
