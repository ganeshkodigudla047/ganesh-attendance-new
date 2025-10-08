const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Approve QR or Manual attendance
router.put('/approve/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

        attendance.approved = true;
        await attendance.save();

        res.status(200).json({ message: 'Attendance approved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
