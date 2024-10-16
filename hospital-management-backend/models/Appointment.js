// const mongoose = require('mongoose');
// const appointmentSchema = new mongoose.Schema({
//   doctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User', 
//   },
//   patient: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   time: {
//     type: String, 
//     required: true,
//   },
//   status: {
//     type: String,
//     default: 'pending',
//   },
// });

// module.exports = mongoose.model('Appointment', appointmentSchema);

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms:{
    type:String,
    required:true,
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);