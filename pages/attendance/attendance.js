document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. CHART JS CONFIG ---
    const chartCanvas = document.getElementById('attendanceChart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [
                    {
                        label: 'Present',
                        data: [60, 80, 55, 90, 45, 70, 65],
                        backgroundColor: '#FF6B00', // Orange
                        borderRadius: 20, // Fully rounded bars
                        barThickness: 15, // Thin bars
                    },
                    {
                        label: 'Absent',
                        data: [10, 5, 15, 5, 20, 10, 5],
                        backgroundColor: '#F3F4F6', // Light Grey
                        borderRadius: 20,
                        barThickness: 15,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: { 
                            usePointStyle: true, 
                            boxWidth: 8,
                            padding: 20,
                            font: { family: "'DM Sans', sans-serif", size: 12 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        border: { display: false },
                        grid: { display: false }, // Remove grid lines like image
                        ticks: { display: true, color: '#A3AED0', stepSize: 20 }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: '#A3AED0' }
                    }
                },
                layout: {
                    padding: 10
                }
            }
        });
    }

    // --- 2. TABLE POPULATION ---
    const employeeData = [
        { name: "Dhamodhar Kamini", id: "0027", email: "Dhamodhar@Gmail.Com", dob: "1971-09-15", join: "2020-05-21", status: "Active" },
        { name: "Saleem", id: "0028", email: "Saleem@Gmail.Com", dob: "1989-07-25", join: "2021-12-01", status: "Active" },
        { name: "Manikanta", id: "0029", email: "Manikanta@Gmail.Com", dob: "1973-12-03", join: "2019-01-31", status: "Active" },
        { name: "Siddarth", id: "0030", email: "Siddarth@Gmail.Com", dob: "1977-06-25", join: "2020-05-21", status: "Active" }
    ];

    const tableBody = document.getElementById('employeeTableBody');

    if (tableBody) {
        tableBody.innerHTML = ""; 
        employeeData.forEach(emp => {
            const row = `
                <tr>
                    <td>${emp.name}</td>
                    <td>${emp.id}</td>
                    <td>${emp.email}</td>
                    <td>${emp.dob}</td>
                    <td>${emp.join}</td>
                    <td><span class="status-active">Active</span></td>
                    <td style="cursor: pointer; color: #999; font-weight: 800;">...</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }
});