/* 
   INTERVIEW MANAGER SCRIPT 
   Prefix: im- (to avoid conflicts with Admin JS)
*/

// 1. State
let imMeetings = [];
let imModalOverlay; // Will be assigned after DOM loads

// 2. Initialization - Waits for HTML to be ready
document.addEventListener('DOMContentLoaded', () => {
    
    // Assign DOM elements to variables
    imModalOverlay = document.getElementById('imModalOverlay');
    const btnOpen = document.getElementById('imBtnOpenModal');
    const btnCancel = document.getElementById('imBtnCancel');
    const btnSave = document.getElementById('imBtnSave');

    // Attach Event Listeners (Cleaner than inline onclick="")
    if(btnOpen) btnOpen.addEventListener('click', imOpenModal);
    if(btnCancel) btnCancel.addEventListener('click', imCloseModal);
    if(btnSave) btnSave.addEventListener('click', imHandleSchedule);

    // Close modal if clicking on the dark overlay background
    window.addEventListener('click', (event) => {
        if (event.target === imModalOverlay) {
            imCloseModal();
        }
    });

    // Initial Render
    imRenderMeetings();
});

// 3. Render Function
function imRenderMeetings() {
    const container = document.getElementById('imListContainer');
    const countLabel = document.getElementById('imTotalCount');
    
    if (!container || !countLabel) return;

    container.innerHTML = '';
    countLabel.textContent = imMeetings.length;

    // Empty State
    if (imMeetings.length === 0) {
        container.innerHTML = `
            <div class="im-empty-state">
                <img src="https://img.icons8.com/ios/100/cbd5e1/calendar--v1.png"/>
                <p>No interviews scheduled yet.<br>Click the button to add one.</p>
            </div>
        `;
        return;
    }

    // Sort: Chronological
    imMeetings.sort((a, b) => a.fullDateObj - b.fullDateObj);

    // Render Items
    imMeetings.forEach(mtg => {
        const card = document.createElement('div');
        card.className = 'im-card';
        
        card.innerHTML = `
            <div class="im-card-info">
                <h4>${mtg.title}</h4>
                <p>With: ${mtg.candidate}</p>
                ${mtg.link ? `<a href="${mtg.link}" target="_blank" class="im-card-link">🔗 Join Meeting</a>` : ''}
            </div>
            <div class="im-card-time-box">
                <div class="im-card-time">${mtg.formattedTime}</div>
                <div class="im-card-date">${mtg.formattedDate}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 4. Modal Functions
function imOpenModal() {
    if (imModalOverlay) {
        imModalOverlay.style.display = 'flex';
        // Auto-fill today's date
        const dateInput = document.getElementById('imInputDate');
        if(dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function imCloseModal() {
    if (imModalOverlay) {
        imModalOverlay.style.display = 'none';
    }
}

// 5. Save & Logic
function imHandleSchedule() {
    // Get values using the new unique IDs
    const title = document.getElementById('imInputTitle').value;
    const candidate = document.getElementById('imInputCandidate').value;
    const link = document.getElementById('imInputLink').value;
    const dateVal = document.getElementById('imInputDate').value;
    const timeVal = document.getElementById('imInputTime').value;

    if(!title || !dateVal || !timeVal) {
        alert("Please fill in Title, Date, and Time.");
        return;
    }

    // Create Date Object
    const fullDateObj = new Date(`${dateVal}T${timeVal}`);
    const formattedTime = fullDateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const formattedDate = fullDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Add to array
    imMeetings.push({
        title, candidate, link, fullDateObj, formattedTime, formattedDate
    });

    // Google Calendar URL Generation
    const endObj = new Date(fullDateObj.getTime() + 60 * 60000); // 1 Hour duration
    const formatGCal = (d) => d.toISOString().replace(/[-:]|\.\d+/g, "");
    
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCal(fullDateObj)}/${formatGCal(endObj)}&details=${encodeURIComponent("Attendee: " + candidate + "\nLink: " + link)}&location=${encodeURIComponent(link)}&sf=true&output=xml`;
    
    window.open(gCalUrl, '_blank');

    // Reset Form
    document.getElementById('imInputTitle').value = '';
    document.getElementById('imInputCandidate').value = '';
    document.getElementById('imInputLink').value = '';
    document.getElementById('imInputTime').value = '';

    imRenderMeetings();
    imCloseModal();
}



/* Recruitment Dashboard Script */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Date Logic
    const rdDateBtn = document.getElementById("rdDateBtn");
    if(rdDateBtn) {
        const now = new Date();
        rdDateBtn.textContent = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }

    // 2. Overview Chart (Doughnut)
    const ctxOverview = document.getElementById("rdRecruitmentChart");
    
    if (ctxOverview) {
        new Chart(ctxOverview, {
            type: "doughnut",
            data: {
                labels: ["Applicants", "Shortlisted", "Hired", "Rejected"],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#cbd5e1"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "75%",
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 10, usePointStyle: true }
                    }
                }
            }
        });
    }

    /* 
       Note: The HTML for "rdTimeToHireChart" was not in your snippet, 
       but I've renamed the JS here just in case you add the canvas later.
    */
    const ctxTime = document.getElementById("rdTimeToHireChart");
    if (ctxTime) {
        new Chart(ctxTime, {
            type: "bar",
            data: {
                labels: ["MKT", "DEV", "DES", "SALES"],
                datasets: [{
                    label: 'Days to Hire',
                    data: [12, 25, 18, 10],
                    backgroundColor: "#64748b",
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
});

// Placeholder function for the button
function rdOpenJobModal() {
    alert("Open 'Add New Job' Modal (Function: rdOpenJobModal)");
}