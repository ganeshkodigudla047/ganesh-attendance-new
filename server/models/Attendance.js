const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: { type: String, required: true },
    method: { type: String, enum: ['Facial','QR','Manual'], required: true },
    status: { type: String, enum: ['Present','Absent'], default: 'Present' },
    date: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false } // For QR/manual approvals
});

module.exports = mongoose.model('Attendance', attendanceSchema);
