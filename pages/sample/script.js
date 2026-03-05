// 1. DATA CONFIGURATION
const departmentData = [
    { name: "IT & Dev", count: 85, color: "var(--col-it)", class: "bg-it" },
    { name: "Content Writers", count: 120, color: "var(--col-content)", class: "bg-content" },
    { name: "HR Team", count: 25, color: "var(--col-hr)", class: "bg-hr" },
    { name: "Management", count: 15, color: "var(--col-mgmt)", class: "bg-mgmt" }
];

document.addEventListener("DOMContentLoaded", () => {
    const svgChart = document.querySelector('.donut-chart');
    const legendList = document.getElementById('legendList');
    const totalDisplay = document.getElementById('totalDisplay');

    // 2. CALCULATE TOTAL
    const total = departmentData.reduce((sum, item) => sum + item.count, 0);
    
    // Animate Total Number
    let currentCount = 0;
    const interval = setInterval(() => {
        // Increment logic
        const increment = Math.ceil(total / 50);
        currentCount += increment;
        
        if(currentCount >= total) {
            currentCount = total;
            clearInterval(interval);
        }
        totalDisplay.innerText = currentCount;
    }, 20);

    // 3. RENDER CHART & LEGEND
    let cumulativePercent = 0;

    departmentData.forEach(dept => {
        // --- A. Render Legend Item ---
        const percentage = ((dept.count / total) * 100).toFixed(1);
        
        const li = document.createElement('li');
        li.className = 'legend-item';
        li.innerHTML = `
            <div class="item-left">
                <span class="color-dot ${dept.class}"></span>
                <div>
                    <span class="dept-name">${dept.name}</span>
                    <span class="dept-percent">${percentage}%</span>
                </div>
            </div>
            <span class="dept-count">${dept.count}</span>
        `;
        legendList.appendChild(li);

        // --- B. Render SVG Segment ---
        // Math: Circumference of a circle with r=40 is approx 251.2
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const segmentLength = (dept.count / total) * circumference;
        
        circle.setAttribute("cx", "50");
        circle.setAttribute("cy", "50");
        circle.setAttribute("r", radius);
        circle.setAttribute("class", "donut-segment");
        circle.setAttribute("stroke", dept.color);
        
        // Calculate offset based on previous segments
        const offset = -1 * (cumulativePercent / 100) * circumference;

        // Set initial state (invisible length) for animation
        circle.style.strokeDasharray = `0 ${circumference}`;
        circle.style.strokeDashoffset = offset;
        
        svgChart.appendChild(circle);

        // Trigger Animation (set actual length)
        setTimeout(() => {
            circle.style.strokeDasharray = `${segmentLength} ${circumference}`;
        }, 100);

        cumulativePercent += (dept.count / total) * 100;
    });
});