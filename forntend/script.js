let token = localStorage.getItem('token') || '';
let userRole = localStorage.getItem('role') || '';

document.getElementById('attendanceForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const method = document.getElementById('method').value;

    if (!token) {
        alert('Please login first!');
        return;
    }

    if (method === 'Facial') {
        startFacialRecognition();
    } else if (method === 'QR') {
        startQRScanner();
    } else {
        alert('Select a valid method');
    }
});

async function startFacialRecognition() {
    const video = document.getElementById('video');
    video.style.display = 'block';

    // Access the camera
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // Simulate recognition success after 5 seconds
        setTimeout(async () => {
            stream.getTracks().forEach(track => track.stop()); // stop camera
            video.style.display = 'none';
            await markAttendance('Facial');
        }, 5000);
    } catch (err) {
        alert('Camera access denied: ' + err.message);
    }
}

async function startQRScanner() {
    const video = document.getElementById('video');
    video.style.display = 'block';
    // QR scanning library logic would go here (like jsQR or html5-qrcode)
    // For now, simulate QR scan success
    setTimeout(async () => {
        video.style.display = 'none';
        await markAttendance('QR');
    }, 5000);
}

async function markAttendance(method) {
    try {
        const res = await fetch('http://localhost:5000/api/attendance/mark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ method })
        });

        const data = await res.json();
        alert(data.message || 'Attendance marked!');
    } catch (err) {
        alert('Error marking attendance: ' + err.message);
    }
}
