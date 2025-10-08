const form = document.getElementById('registerForm');
const videoContainer = document.getElementById('videoContainer');
const video = document.getElementById('video');

let faceData = '';

// Listen for role selection to open camera for students
document.getElementById('registerRole').addEventListener('change', async (e) => {
    if (e.target.value === 'Student') {
        videoContainer.style.display = 'block';
        // Open camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            alert('Cannot access camera: ' + err.message);
        }
    } else {
        videoContainer.style.display = 'none';
        faceData = '';
        // Stop camera if running
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
});

// Handle registration submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    // If student, capture face snapshot
    if (role === 'Student') {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        faceData = canvas.toDataURL('image/png'); // base64 string
    }

    try {
        const res = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, faceData })
        });

        const data = await res.json();

        if (res.status === 201) {
            alert('Registration successful! Please login.');
            form.reset();
            // Stop camera if running
            if (video.srcObject) video.srcObject.getTracks().forEach(track => track.stop());
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (err) {
        alert('Registration error: ' + err.message);
    }
});
