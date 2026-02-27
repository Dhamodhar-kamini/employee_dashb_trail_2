document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Salary Range Bar Chart ---
    const ctxBar = document.getElementById('salaryBarChart').getContext('2d');
    
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['$30k-50k', '$50k-80k', '$80k-120k', '$120k-180k', '$180k+'], // Simplified labels
            datasets: [{
                data: [25, 60, 20, 30, 45, 10, 50, 40, 35, 20], // Random data to match shape
                labels: ['30k', '40k', '50k', '60k', '70k', '80k', '90k', '100k', '110k', '120k'], // Actual x-axis
                backgroundColor: function(context) {
                    const index = context.dataIndex;
                    // Highlight the 2nd bar to match image
                    return index === 1 ? '#FF5B1E' : '#E5E7EB'; 
                },
                borderRadius: 4,
                barThickness: 10,
                hoverBackgroundColor: '#FF5B1E'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) { return '$' + value + 'k'; }, // Format Y axis
                        color: '#9CA3AF',
                        font: { size: 10 }
                    },
                    grid: { display: false },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { display: false } // Hide X labels to look cleaner like design
                }
            }
        },
        data: {
            // Overriding structure to match the many thin bars in the image
            labels: Array.from({length: 12}, (_, i) => i), 
            datasets: [{
                data: [20, 65, 30, 40, 50, 25, 60, 55, 45, 30, 55, 20],
                backgroundColor: (ctx) => ctx.dataIndex === 1 ? '#FF5B1E' : '#F3F4F6',
                borderRadius: 50,
                barThickness: 12
            }]
        }
    });


    // --- 2. Trend Line Chart ---
    const ctxLine = document.getElementById('trendChart').getContext('2d');

    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Federal Tax',
                    data: [300, 300, 220, 220, 220, 220],
                    borderColor: '#164E63', // Dark Blue
                    backgroundColor: '#164E63',
                    borderWidth: 2,
                    stepped: true, // Key for the square shape
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Deductions',
                    data: [150, 150, 150, 10, 70, 150],
                    borderColor: '#FF5B1E', // Orange
                    backgroundColor: '#FF5B1E',
                    borderWidth: 2,
                    stepped: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, // Custom legend used in HTML
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'white',
                    titleColor: '#111',
                    bodyColor: '#666',
                    borderColor: '#e5e7eb',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
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
                        display: true,
                        color: '#F3F4F6'
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

    // --- Interactive Elements (Optional) ---
    
    // Quick Action Chips Selection
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // Simple Console Log for Buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Button clicked:', btn.innerText || 'Icon Button');
        });
    });
});