// require('dotenv').config(); 
// const request = require('supertest');
// const express = require('express');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const app = express();
// const appointmentRoutes = require('../routes/appointmentRoutes');
// const User = require('../models/User');
// const Appointment = require('../models/Appointment');

// app.use(express.json());
// app.use('/api/appointments', appointmentRoutes);

// const mongoURI = process.env.MONGO_URL; 
// const jwtSecret = process.env.JWT_SECRET;

// test('should create a doctor and get a token', async () => {
//     await mongoose.connect(mongoURI);

//     const doctorData = {
//         email: `doctor_${Date.now()}@example.com`, 
//         password: 'password123',
//         role: 'doctor',
//         name: 'Dr. Example',
//         specialization: 'Cardiology'
//     };
//     const doctor = await User.create(doctorData);
    
//     const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

//     expect(doctor).toHaveProperty('_id');
//     expect(token).toBeDefined();

//     await User.deleteOne({ _id: doctor._id }); 
//     await mongoose.connection.close();
// });

// test('should book an appointment', async () => {
//     await mongoose.connect(mongoURI);

//     const doctorData = {
//         email: `doctor_${Date.now()}@example.com`, 
//         password: 'password123',
//         role: 'doctor',
//         name: 'Dr. Example',
//         specialization: 'Cardiology'
//     };
//     const doctor = await User.create(doctorData);

//     const patientData = {
//         email: `patient_${Date.now()}@example.com`,
//         password: 'password123',
//         role: 'patient',
//         name: 'Patient Example'
//     };
//     const patient = await User.create(patientData);

//     const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

//     const response = await request(app)
//         .post('/api/appointments/book')
//         .set('Authorization', `Bearer ${token}`)
//         .send({ doctorId: doctor._id, slot: '2024-10-15T10:00:00Z' });

//     expect(response.status).toBe(201);
//     expect(response.body.message).toBe('Appointment booked successfully.');

//     await User.deleteOne({ _id: doctor._id }); 
//     await User.deleteOne({ _id: patient._id }); 
//     await mongoose.connection.close();
// });

// test('should get patient appointments', async () => {
//     await mongoose.connect(mongoURI);

//     const doctorData = {
//         email: `doctor_${Date.now()}@example.com`, 
//         password: 'password123',
//         role: 'doctor',
//         name: 'Dr. Example',
//         specialization: 'Cardiology'
//     };
//     const doctor = await User.create(doctorData);

//     const patientData = {
//         email: `patient_${Date.now()}@example.com`, 
//         password: 'password123',
//         role: 'patient',
//         name: 'Patient Example'
//     };
//     const patient = await User.create(patientData);

//     const token = jwt.sign({ id: patient._id, role: 'patient' }, jwtSecret);

//     await Appointment.create({
//         doctor: doctor._id,
//         patient: patient._id,
//         date: '2024-10-15T10:00:00Z',
//         status: 'pending'
//     });

//     const response = await request(app)
//         .get('/api/appointments/patient')
//         .set('Authorization', `Bearer ${token}`); 
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBeGreaterThan(0);

//     await User.deleteOne({ _id: doctor._id });
//     await User.deleteOne({ _id: patient._id }); 
//     await mongoose.connection.close();
// });

// test('should update appointment status', async () => {
//     await mongoose.connect(mongoURI);

//     const doctorData = {
//         email: `doctor_${Date.now()}@example.com`,
//         password: 'password123',
//         role: 'doctor',
//         name: 'Dr. Example',
//         specialization: 'Cardiology'
//     };
//     const doctor = await User.create(doctorData);

//     const patientData = {
//         email: `patient_${Date.now()}@example.com`,
//         password: 'password123',
//         role: 'patient',
//         name: 'Patient Example'
//     };
//     const patient = await User.create(patientData);

//     const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

//     const appointment = await Appointment.create({
//         doctor: doctor._id,
//         patient: patient._id,
//         date: '2024-10-15T10:00:00Z',
//         status: 'pending'
//     });

//     const response = await request(app)
//         .patch(`/api/appointments/${appointment._id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ status: 'accepted' }); 
//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Appointment status updated');
//     expect(response.body.appointment.status).toBe('accepted');

//     await User.deleteOne({ _id: doctor._id });
//     await User.deleteOne({ _id: patient._id });
//     await mongoose.connection.close();
// });

// test('should return available slots', async () => {
//     await mongoose.connect(mongoURI);

//     const doctorData = {
//         email: `doctor_${Date.now()}@example.com`,
//         password: 'password123',
//         role: 'doctor',
//         name: 'Dr. Example',
//         specialization: 'Cardiology'
//     };
//     const doctor = await User.create(doctorData);

//     const patientData = {
//         email: `patient_${Date.now()}@example.com`,
//         password: 'password123',
//         role: 'patient',
//         name: 'Patient Example'
//     };
//     const patient = await User.create(patientData);

//     const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

//     await Appointment.create({
//         doctor: doctor._id,
//         patient: patient._id,
//         date: '2024-10-15T10:00:00Z',
//         status: 'pending'
//     });

//     const response = await request(app)
//         .get('/api/appointments/available')
//         .set('Authorization', `Bearer ${token}`)
//         .query({ doctorId: doctor._id.toString(), date: '10-15-2024' }); 

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBeLessThan(32);

//     await User.deleteOne({ _id: doctor._id });
//     await User.deleteOne({ _id: patient._id });
//     await mongoose.connection.close();
// });
// test('should return available slots', async () => {
//     await mongoose.connect(mongoURI);


//     const doctorData = {
//         email: `doctor_${Date.now()}@example.com`, 
//         password: 'password123',
//         role: 'doctor',
//         name: 'Dr. Example',
//         specialization: 'Cardiology'
//     };
//     const doctor = await User.create(doctorData);

//     const patientData = {
//         email: `patient_${Date.now()}@example.com`, 
//         password: 'password123',
//         role: 'patient',
//         name: 'Patient Example'
//     };
//     const patient = await User.create(patientData);

    
//     const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);


//     await Appointment.create({
//         doctor: doctor._id,
//         patient: patient._id,
//         date: new Date('2024-10-15T10:00:00Z'),  
//         status: 'pending'
//     });

    
//     const response = await request(app)
//         .get('/api/appointments/available')
//         .set('Authorization', `Bearer ${token}`)
//         .query({ doctorId: doctor._id.toString(), date: '2024-10-15T00:00:00Z' }); 
   
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBeLessThan(32);

 
//     await User.deleteOne({ _id: doctor._id }); 
//     await User.deleteOne({ _id: patient._id });
//     await mongoose.connection.close();
// });

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

    test('should book an appointment', async () => {
        const doctor = await createDoctor();
        const patient = await createPatient();
        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, jwtSecret);

        const response = await request(app)
            .post('/api/appointments/book')
            .set('Authorization', `Bearer ${token}`)
            .send({ doctorId: doctor._id, slot: '2024-10-15T10:00:00Z' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Appointment booked successfully.');

        await User.deleteOne({ _id: doctor._id }); 
        await User.deleteOne({ _id: patient._id }); 
    });

    test('should get patient appointments', async () => {
        const doctor = await createDoctor();
        const patient = await createPatient();
        const token = jwt.sign({ id: patient._id, role: 'patient' }, jwtSecret);

        await Appointment.create({
            doctor: doctor._id,
            patient: patient._id,
            date: '2024-10-15T10:00:00Z',
            status: 'pending'
        });

        const response = await request(app)
            .get('/api/appointments/patient')
            .set('Authorization', `Bearer ${token}`); 
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

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
