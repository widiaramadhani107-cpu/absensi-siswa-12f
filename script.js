let students = JSON.parse(localStorage.getItem('students')) || [];

if (students.length === 0) {
    students = [
        {
            name: 'Ahmad',
            attendance: [
                { date: '2026-01-15', time: '08:00', status: 'present', location: { lat: -6.2088, lng: 106.8456 } },
                { date: '2026-01-16', time: '08:05', status: 'absent', location: { lat: -6.2088, lng: 106.8456 } },
                { date: '2026-01-17', time: '08:10', status: 'present', location: { lat: -6.2088, lng: 106.8456 } }
            ]
        },
        {
            name: 'Budi',
            attendance: [
                { date: '2026-01-15', time: '08:00', status: 'present', location: { lat: -6.2088, lng: 106.8456 } },
                { date: '2026-01-16', time: '08:05', status: 'present', location: { lat: -6.2088, lng: 106.8456 } }
            ]
        },
        {
            name: 'Citra',
            attendance: [
                { date: '2026-01-15', time: '08:00', status: 'absent', location: { lat: -6.2088, lng: 106.8456 } },
                { date: '2026-01-17', time: '08:10', status: 'present', location: { lat: -6.2088, lng: 106.8456 } }
            ]
        },
        {
            name: 'Dewi',
            attendance: [
                { date: '2026-01-15', time: '08:00', status: 'present', location: { lat: -6.2088, lng: 106.8456 } }
            ]
        },
        {
            name: 'Eko',
            attendance: [
                { date: '2026-01-16', time: '08:05', status: 'absent', location: { lat: -6.2088, lng: 106.8456 } }
            ]
        }
    ];
    localStorage.setItem('students', JSON.stringify(students));
}

function renderStudents() {
    const list = document.getElementById('studentList');
    list.innerHTML = '';
    students.forEach((student, index) => {
        // Ensure attendance array exists
        if (!student.attendance) student.attendance = [];
        const latest = student.attendance.length > 0 ? student.attendance[student.attendance.length - 1] : null;
        let statusText = latest ? `Status: ${latest.status} pada ${latest.date} pukul ${latest.time}` : 'Belum ditandai';
        if (latest && latest.location) {
            statusText += ` (Lat: ${latest.location.lat.toFixed(4)}, Lng: ${latest.location.lng.toFixed(4)})`;
        }
        if (latest && latest.status === 'present' && isLate(latest.time)) {
            statusText += ' (Terlambat)';
        }
        const li = document.createElement('li');
        li.className = 'student';
        li.innerHTML = `
            ${student.name} - Status: <span class="${latest ? latest.status : ''}">${statusText}</span>
            <button onclick="markPresent(${index})">Present</button>
            <button onclick="markAbsent(${index})">Absent</button>
        `;
        list.appendChild(li);
    });
}

function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    if (name) {
        if (students.some(student => student.name === name)) {
            alert('Siswa dengan nama ini sudah ada.');
            return;
        }
        students.push({ name, attendance: [] });
        localStorage.setItem('students', JSON.stringify(students));
        document.getElementById('studentName').value = '';
        renderStudents();
    }
}

function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS, but take HH:MM
    return { date, time: time.substring(0, 5) };
}

function isLate(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m;
    return total > 7 * 60 + 30; // After 07:30
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            position => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
            error => reject(error.message)
        );
    });
}

async function markPresent(index) {
    const { date, time } = getCurrentDateTime();
    if (students[index].attendance.some(record => record.date === date)) {
        alert('Anda sudah menandai absensi hari ini.');
        return;
    }
    let location = null;
    try {
        location = await getLocation();
    } catch (error) {
        console.log('Location not available:', error);
    }
    students[index].attendance.push({ date, time, status: 'present', location });
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
}

async function markAbsent(index) {
    const { date, time } = getCurrentDateTime();
    if (students[index].attendance.some(record => record.date === date)) {
        alert('Anda sudah menandai absensi hari ini.');
        return;
    }
    let location = null;
    try {
        location = await getLocation();
    } catch (error) {
        console.log('Location not available:', error);
    }
    students[index].attendance.push({ date, time, status: 'absent', location });
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
}

renderStudents();