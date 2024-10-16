require('dotenv').config(); 
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const appointmentRoutes = require('../routes/appointmentRoutes');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

app.use(express.json());
app.use('/api/appointments', appointmentRoutes);

const mongoURI = process.env.MONGO_URL; 
const jwtSecret = process.env.JWT_SECRET;

describe('Appointment Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.connection.close(); 
    });

    const createDoctor = async () => {
        const doctorData = {
            email: `doctor_${Date.now()}@example.com`, 
            password: 'password123',
            role: 'doctor',
            name: 'Dr. Example',
            specialization: 'Cardiology'
        };
        return await User.create(doctorData);
    };

    const createPatient = async () => {
        const patientData = {
            email: `patient_${Date.now()}@example.com`,
            password: 'password123',
            role: 'patient',
            name: 'Patient Example'
        };
        return await User.create(patientData);
    };

    test('should create a doctor and get a token', async () => {
        const doctor = await createDoctor();
        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

        expect(doctor).toHaveProperty('_id');
        expect(token).toBeDefined();

        await User.deleteOne({ _id: doctor._id }); 
    });

    test('should book an appointment with symptoms', async () => {
        const doctor = await createDoctor();
        const patient = await createPatient();
        const token = jwt.sign({ id: patient._id, role: 'patient' }, jwtSecret); // Use patient's token

        const response = await request(app)
            .post('/api/appointments/book')
            .set('Authorization', `Bearer ${token}`)
            .send({ doctorId: doctor._id, slot: '2024-10-15T10:00:00Z', symptoms: 'Headache' }); // Added symptoms

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Appointment booked successfully.');

        await User.deleteOne({ _id: doctor._id }); 
        await User.deleteOne({ _id: patient._id }); 
    });

    test('should get patient appointments including symptoms', async () => {
        const doctor = await createDoctor();
        const patient = await createPatient();
        const token = jwt.sign({ id: patient._id, role: 'patient' }, jwtSecret);

        const symptoms = 'Fever'; // Define symptoms for the appointment
        await Appointment.create({
            doctor: doctor._id,
            patient: patient._id,
            date: '2024-10-15T10:00:00Z',
            symptoms, // Use defined symptoms
            status: 'pending'
        });

        const response = await request(app)
            .get('/api/appointments/patient')
            .set('Authorization', `Bearer ${token}`); 
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('symptoms', symptoms); // Check for symptoms

        await User.deleteOne({ _id: doctor._id });
        await User.deleteOne({ _id: patient._id }); 
    });

    test('should update appointment status', async () => {
        const doctor = await createDoctor();
        const patient = await createPatient();
        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

        const appointment = await Appointment.create({
            doctor: doctor._id,
            patient: patient._id,
            date: '2024-10-15T10:00:00Z',
            symptoms: 'Sore throat', // Added symptoms
            status: 'pending'
        });

        const response = await request(app)
            .patch(`/api/appointments/${appointment._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'accepted' }); 
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Appointment status updated');
        expect(response.body.appointment.status).toBe('accepted');

        await User.deleteOne({ _id: doctor._id });
        await User.deleteOne({ _id: patient._id });
    });

    test('should return available slots', async () => {
        const doctor = await createDoctor();
        const patient = await createPatient();
        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

        await Appointment.create({
            doctor: doctor._id,
            patient: patient._id,
            date: '2024-10-15T10:00:00Z',
            symptoms: 'Back pain', // Added symptoms
            status: 'pending'
        });

        const response = await request(app)
            .get('/api/appointments/available')
            .set('Authorization', `Bearer ${token}`)
            .query({ doctorId: doctor._id.toString(), date: '2024-10-15' }); 

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThan(32);

        await User.deleteOne({ _id: doctor._id }); 
        await User.deleteOne({ _id: patient._id });
    });
});
