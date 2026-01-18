let students = JSON.parse(localStorage.getItem('students')) || [];

function isLate(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m;
    return total > 7 * 60 + 30; // After 07:30
}

function renderAttendance() {
    const tbody = document.getElementById('attendanceBody');
    tbody.innerHTML = '';
    students.forEach(student => {
        if (student.attendance) {
            student.attendance.forEach(record => {
                const tr = document.createElement('tr');
                const loc = record.location ? `${record.location.lat.toFixed(4)}, ${record.location.lng.toFixed(4)}` : 'N/A';
                const status = record.status + (record.status === 'present' && isLate(record.time) ? ' (Terlambat)' : '');
                const statusClass = record.status;
                const displayStatus = statusClass === 'present' ? 'Hadir' : 'Tidak Hadir';
                const finalStatus = displayStatus + (record.status === 'present' && isLate(record.time) ? ' (Terlambat)' : '');
                tr.innerHTML = `
                    <td>${student.name}</td>
                    <td>${record.date}</td>
                    <td>${record.time}</td>
                    <td class="${record.status}">${finalStatus}</td>
                    <td>${loc}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    });
}

renderAttendance();