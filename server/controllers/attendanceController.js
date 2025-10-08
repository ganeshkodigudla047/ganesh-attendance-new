const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
    try {
        const { method } = req.body;
        const student = req.user.name; // From JWT
        const role = req.user.role;

        if (method === 'Manual' && role !== 'Incharge') {
            return res.status(403).json({ message: 'Only Incharge can mark manual attendance' });
        }
        if (method === 'QR' && role === 'Student') {
            return res.status(403).json({ message: 'QR attendance requires admin approval' });
        }
        if (method === 'Facial' && role !== 'Student') {
            return res.status(403).json({ message: 'Only students can mark facial attendance' });
        }

        const newAttendance = new Attendance({
            student,
            method,
            approved: method === 'Facial'
        });

        await newAttendance.save();
        let msg = `Attendance marked successfully by ${method}`;
        if (method !== 'Facial') msg += ', pending admin approval';

        res.status(201).json({ message: msg });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
