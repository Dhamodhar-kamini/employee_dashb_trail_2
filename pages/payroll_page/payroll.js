document.addEventListener('DOMContentLoaded', function() {
    
    // 1. GLOBAL DEFAULTS
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#6B7280';

    // ==========================================
    // 2. SALARY RANGE BAR CHART (Vertical Pill Bars)
    // ==========================================
    const barChartCanvas = document.getElementById('salaryBarChart');
    
    if (barChartCanvas) {
        const ctxBar = barChartCanvas.getContext('2d');
        
        // Define data outside so we can calculate the max value for coloring
        const salaryData = [20, 65, 30, 40, 50, 25, 60, 55, 45, 30, 55, 20];
        const maxSalary = Math.max(...salaryData); // Find the highest number (65)

        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
                datasets: [{
                    label: 'Salary Distribution',
                    data: salaryData,
                    
                    // --- COLOR FILL LOGIC ---
                    // Automatically fills the highest bar with Orange, others Gray
                    backgroundColor: function(context) {
                        // Check if the current bar's value equals the maximum value
                        return context.raw === maxSalary ? '#FF5B1E' : '#F3F4F6'; 
                    },
                    
                    // Hover color logic
                    hoverBackgroundColor: function(context) {
                        return context.raw === maxSalary ? '#FF5B1E' : '#E5E7EB'; 
                    },
                    
                    // --- SHAPE STYLING ---
                    borderRadius: 50,      // Fully rounded ends (Pill shape)
                    borderSkipped: false,  // false = rounds the bottom as well
                    barThickness: 16,      // Width of the bars
                    borderWidth: 0         // No border stroke, purely filled
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { 
                        enabled: true,
                        backgroundColor: '#1F2937', // Dark tooltip background
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false, // Hides the color square
                        callbacks: {
                            title: () => null, // Hide title
                            label: (context) => `Avg: $${context.raw}k`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 80, // Adjust this based on your highest data point
                        ticks: {
                            callback: function(value) { return '$' + value + 'k'; }, 
                            color: '#9CA3AF',
                            font: { size: 11 },
                            stepSize: 20,
                            padding: 10
                        },
                        grid: { display: false }, // Clean look, no grid
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { display: false } // Hide X-axis labels (abstract look)
                    }
                }
            }
        });
    }


    // ==========================================
    // 3. TREND LINE CHART (Stepped Lines)
    // ==========================================
    const lineChartCanvas = document.getElementById('trendChart');

    if (lineChartCanvas) {
        const ctxLine = lineChartCanvas.getContext('2d');

        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Federal Tax',
                        data: [300, 300, 220, 220, 220, 220],
                        borderColor: '#164E63', // Navy Blue
                        backgroundColor: '#164E63',
                        pointBackgroundColor: '#164E63',
                        borderWidth: 2,
                        stepped: 'middle', // Squared lines
                        pointRadius: 0,    // Hide dots until hover
                        pointHoverRadius: 6,
                        tension: 0,
                        fill: false
                    },
                    {
                        label: 'Deductions',
                        data: [150, 150, 150, 10, 70, 150],
                        borderColor: '#FF5B1E', // Orange
                        backgroundColor: '#FF5B1E',
                        pointBackgroundColor: '#FF5B1E',
                        borderWidth: 2,
                        stepped: 'middle',
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        tension: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: { display: false }, 
                    tooltip: {
                        backgroundColor: '#FFFFFF',
                        titleColor: '#111827',
                        bodyColor: '#4B5563',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        padding: 10,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                return ' ' + context.dataset.label + ': $' + context.parsed.y + 'k';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 350,
                        ticks: {
                            callback: function(value) { return '$' + value + 'k'; },
                            color: '#9CA3AF',
                            font: { size: 10 },
                            stepSize: 87.5
                        },
                        grid: {
                            color: '#F3F4F6',
                            drawBorder: false
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: {
                            color: '#F3F4F6',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9CA3AF',
                            font: { size: 10 }
                        },
                        border: { display: false }
                    }
                }
            }
        });
    }

    // ==========================================
    // 4. UI INTERACTIONS (Chips & Buttons)
    // ==========================================
    
    // Chip Selection (Time Range)
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from siblings
            const container = this.parentNode;
            container.querySelectorAll('.chip').forEach(s => s.classList.remove('active'));
            // Add active class to clicked chip
            this.classList.add('active');
        });
    });

    // Button Press Animation
    const buttons = document.querySelectorAll('button:not([type="submit"])');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function() { this.style.transform = "scale(0.96)"; });
        btn.addEventListener('mouseup', function() { this.style.transform = "scale(1)"; });
        btn.addEventListener('mouseleave', function() { this.style.transform = "scale(1)"; });
    });

});

//notification section
//notification section
let notifications = [
    {
        id: 1,
        text: "<strong>Dhamodhar</strong> applied for the UX Designer position.",
        time: "2 mins ago",
        icon: "👩‍💼", // Using emojis as placeholders for images
        read: false
    },
    {
        id: 2,
        text: "Meeting with <strong>Dev Team</strong> starts in 15 minutes.",
        time: "15 mins ago",
        icon: "📅",
        read: false
    },
    {
        id: 3,
        text: "New system update available.",
        time: "1 hour ago",
        icon: "⚙️",
        read: true
    },
    {
        id: 4,
        text: "<strong>Arjun</strong> accepted the offer.",
        time: "3 hours ago",
        icon: "✅",
        read: true
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // Select Elements
    const bellBtn = document.getElementById('ntBellBtn');
    const dropdown = document.getElementById('ntDropdown');
    const markReadBtn = document.getElementById('ntMarkAllRead');

    // Initialize
    ntRenderList();

    // Toggle Dropdown
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate closing
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Mark All as Read
    markReadBtn.addEventListener('click', () => {
        notifications.forEach(n => n.read = true);
        ntRenderList();
    });

    // Close Dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
});

// Render Function
function ntRenderList() {
    const listContainer = document.getElementById('ntList');
    const badge = document.getElementById('ntBadge');
    
    // Clear current list
    listContainer.innerHTML = '';

    // Count unread
    const unreadCount = notifications.filter(n => !n.read).length;

    // Update Badge
    if (unreadCount > 0) {
        badge.style.display = 'flex';
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    } else {
        badge.style.display = 'none';
    }

    // Check if empty
    if (notifications.length === 0) {
        listContainer.innerHTML = '<div class="nt-empty">No notifications</div>';
        return;
    }

    // Build List
    notifications.forEach(item => {
        const itemDiv = document.createElement('div');
        // Add class 'nt-unread' if not read
        itemDiv.className = `nt-item ${!item.read ? 'nt-unread' : ''}`;
        
        itemDiv.innerHTML = `
            <div class="nt-avatar">${item.icon}</div>
            <div class="nt-content">
                <p class="nt-text">${item.text}</p>
                <span class="nt-time">${item.time}</span>
            </div>
        `;

        // Click individual item to mark as read
        itemDiv.addEventListener('click', () => {
            item.read = true;
            ntRenderList();
        });

        listContainer.appendChild(itemDiv);
    });
}