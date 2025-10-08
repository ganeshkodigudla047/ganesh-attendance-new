let token = localStorage.getItem('token') || '';
let userRole = localStorage.getItem('role') || '';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.token) {
            alert('Login successful!');
            token = data.token;
            userRole = data.role;
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);

            if(userRole === 'Student') window.location.href = 'attendance.html';
            else window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) {
        alert('Login error: ' + err.message);
    }
});
