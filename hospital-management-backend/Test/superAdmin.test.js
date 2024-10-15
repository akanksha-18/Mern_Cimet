const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { superAdminRoutes } = require('../routes/superAdminRoutes');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

jest.mock('../middleware/authenticate', () => (req, res, next) => {
  req.user = { role: 'superadmin' };
  next();
});

jest.mock('../middleware/superAdminAuth', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/superadmin/api', superAdminRoutes);

const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/test_doctor_appointment_db';

beforeAll(async () => {
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('SuperAdmin Appointment Routes', () => {
  let doctorId;

  beforeEach(async () => {
    // Create a doctor
    const doctor = await User.create({
      name: 'Dr. Test',
      email: 'doctor@example.com',
      password: 'hashedPassword',
      role: 'doctor',
      specialization: 'General'
    });
    doctorId = doctor._id;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Appointment.deleteMany({});
  });

  test('POST /superadmin/api/doctors - Create a new doctor', async () => {
    const response = await request(app)
      .post('/superadmin/api/doctors')
      .send({
        name: 'Dr. New',
        email: 'newdoctor@example.com',
        password: 'password123',
        specialization: 'Cardiology'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Doctor created successfully.');
    expect(response.body.doctor).toHaveProperty('name', 'Dr. New');
    expect(response.body.doctor).toHaveProperty('role', 'doctor');
  });

  test('DELETE /superadmin/api/doctors/:id - Delete a doctor', async () => {
    const response = await request(app)
      .delete(`/superadmin/api/doctors/${doctorId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Doctor deleted successfully.');
  });

  test('GET /superadmin/api/doctors - Get all doctors', async () => {
    const response = await request(app)
      .get('/superadmin/api/doctors');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /superadmin/api/patients - Get all patients', async () => {
    await User.create({
      name: 'Test Patient',
      email: 'patient@example.com',
      password: 'password123',
      role: 'patient'
    });

    const response = await request(app)
      .get('/superadmin/api/patients');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('role', 'patient');
  });

  test('POST /superadmin/api/patients - Create a new patient', async () => {
    const response = await request(app)
      .post('/superadmin/api/patients')
      .send({
        name: 'New Patient',
        email: 'newpatient@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Patient created successfully.');
    expect(response.body.patient).toHaveProperty('name', 'New Patient');
    expect(response.body.patient).toHaveProperty('role', 'patient');
  });

  test('DELETE /superadmin/api/patients/:id - Delete a patient', async () => {
    const patient = await User.create({
      name: 'Test Patient',
      email: 'patient@example.com',
      password: 'password123',
      role: 'patient'
    });

    const response = await request(app)
      .delete(`/superadmin/api/patients/${patient._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Patient deleted successfully.');
  });
});