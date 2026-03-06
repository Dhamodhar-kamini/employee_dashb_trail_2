document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURATION ---
    let currentTotalEmployees = 50; // Initial value
    const START_HOUR = 10;
    const GRACE_MIN = 10; 
    
    // Selectors
    const staffInput = document.getElementById('staffCount');
    const monthSelect = document.getElementById('monthFilter');
    const yAxis = document.getElementById('yAxis');
    const barsContainer = document.getElementById('barsContainer');
    const xLabelsContainer = document.getElementById('xLabels');
    
    // Stats Elements
    const statOntime = document.getElementById('avgOntime');
    const statLate = document.getElementById('avgLate');
    const statAbsent = document.getElementById('avgAbsent');

    // --- 2. UPDATE Y-AXIS VISUALS ---
    function updateYAxisLabels() {
        yAxis.innerHTML = '';
        
        // Generate 6 steps (0, 20%, 40%, 60%, 80%, 100%)
        for(let i=0; i<=5; i++) {
            const val = Math.round((currentTotalEmployees / 5) * i);
            const span = document.createElement('span');
            span.innerText = val;
            yAxis.appendChild(span);
        }
    }

    // --- 3. DATA GENERATOR (Simulating DB) ---
    function generateMonthData(monthIndex) {
        // Calculate days in month for current year (using fixed year 2025 for demo)
        const daysInMonth = new Date(2025, parseInt(monthIndex) + 1, 0).getDate();
        const dailyData = [];

        for (let day = 1; day <= daysInMonth; day++) {
            
            let dayStats = { 
                day: day, 
                late: 0, 
                ontime: 0, 
                absent: 0 
            };

            // Loop through current dynamic count
            for (let emp = 0; emp < currentTotalEmployees; emp++) {
                const rand = Math.random();

                // 10% Chance Absent
                if (rand < 0.10) { 
                    dayStats.absent++;
                } else {
                    // Present
                    // Random time generation
                    const hour = Math.random() > 0.7 ? 10 : 9; 
                    const min = Math.floor(Math.random() * 60);
                    
                    let isLate = false;
                    if (hour > START_HOUR) isLate = true;
                    if (hour === START_HOUR && min > GRACE_MIN) isLate = true;

                    if (isLate) dayStats.late++;
                    else dayStats.ontime++;
                }
            }
            dailyData.push(dayStats);
        }
        return dailyData;
    }

    // --- 4. RENDER LOGIC ---
    function runSimulation() {
        // Update Y-Axis Scale first
        updateYAxisLabels();

        const monthIndex = monthSelect.value;
        const data = generateMonthData(monthIndex);
        
        barsContainer.innerHTML = "";
        xLabelsContainer.innerHTML = "";

        // Aggregators for Stats
        let totalLate = 0;
        let totalAbsent = 0;
        let totalOntime = 0;

        // Render Daily Bars
        data.forEach((dayData, index) => {
            totalLate += dayData.late;
            totalAbsent += dayData.absent;
            totalOntime += dayData.ontime;

            // Percentages for CSS Height (Relative to currentTotalEmployees)
            const hLate = (dayData.late / currentTotalEmployees) * 100;
            const hOntime = (dayData.ontime / currentTotalEmployees) * 100;
            const hAbsent = (dayData.absent / currentTotalEmployees) * 100;

            // Create Stacked Column
            const col = document.createElement('div');
            col.className = 'bar-col';
            // Tooltip shows dynamic total
            col.setAttribute('data-tooltip', `Day ${dayData.day}\nOn Time: ${dayData.ontime}\nLate: ${dayData.late}\nAbsent: ${dayData.absent}\nTotal Staff: ${currentTotalEmployees}`);

            col.innerHTML = `
                <div class="bar-segment bg-late" style="height: ${hLate}%"></div>
                <div class="bar-segment bg-ontime" style="height: ${hOntime}%"></div>
                <div class="bar-segment bg-absent" style="height: ${hAbsent}%"></div>
            `;
            barsContainer.appendChild(col);

            // Create X-Label (every 5th day to avoid clutter)
            if (index === 0 || (index + 1) % 5 === 0) {
                const label = document.createElement('div');
                label.className = 'x-label';
                label.innerText = dayData.day;
                
                // Calculate position percentage
                const leftPos = (index / (data.length - 1)) * 100;
                // Adjust slightly so last label doesn't overflow
                label.style.position = 'absolute';
                
                // Simple positioning logic
                if (index === 0) label.style.left = '0%';
                else if (index === data.length - 1) label.style.right = '0%';
                else label.style.left = `${leftPos}%`;
                
                xLabelsContainer.appendChild(label);
            }
        });

        // Update Stats Sidebar
        const daysCount = data.length;
        statOntime.innerText = (totalOntime / daysCount).toFixed(0);
        statLate.innerText = (totalLate / daysCount).toFixed(0);
        statAbsent.innerText = (totalAbsent / daysCount).toFixed(0);
    }

    // --- 5. EVENT LISTENERS ---
    
    // Update when input number changes
    staffInput.addEventListener('change', () => {
        const inputVal = staffInput.value;
        if(inputVal && inputVal > 0) {
            currentTotalEmployees = parseInt(inputVal);
            runSimulation(); 
        }
    });

    // Update when month selection changes
    monthSelect.addEventListener('change', runSimulation);

    // Initial Run
    runSimulation();
});