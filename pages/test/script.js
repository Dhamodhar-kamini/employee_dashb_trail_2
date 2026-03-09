// 1. Data State (Starts Empty)
let meetings = [];

// 2. Render Function (Handles Empty State & Sorting)
function renderMeetings() {
    const container = document.getElementById('interviewListContainer');
    const countLabel = document.getElementById('totalCount');
    
    container.innerHTML = '';
    countLabel.textContent = meetings.length;

    // Empty State Logic
    if (meetings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <img src="https://img.icons8.com/ios/100/cbd5e1/calendar--v1.png"/>
                <p>No interviews scheduled yet.<br>Click the button to add one.</p>
            </div>
        `;
        return;
    }

    // Sort Logic (Chronological: Date + Time)
    meetings.sort((a, b) => a.fullDateObj - b.fullDateObj);

    // Render List
    meetings.forEach(mtg => {
        const card = document.createElement('div');
        card.className = 'interview-card';
        
        // Truncate link for display
        const displayLink = mtg.link ? (mtg.link.substring(0, 30) + '...') : 'No link provided';

        card.innerHTML = `
            <div class="card-info">
                <h4>${mtg.title}</h4>
                <p>With: ${mtg.candidate}</p>
                ${mtg.link ? `<a href="${mtg.link}" target="_blank" class="card-link">🔗 Join Meeting</a>` : ''}
            </div>
            <div class="card-time-box">
                <div class="card-time">${mtg.formattedTime}</div>
                <div class="card-date">${mtg.formattedDate}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. Add Meeting Logic
function handleSchedule() {
    // Get values
    const title = document.getElementById('intTitle').value;
    const candidate = document.getElementById('intCandidate').value;
    const link = document.getElementById('intLink').value;
    const dateVal = document.getElementById('intDate').value;
    const timeVal = document.getElementById('intTime').value;

    if(!title || !dateVal || !timeVal) {
        alert("Please fill in Title, Date, and Time.");
        return;
    }

    // Create Date Object for sorting and formatting
    const fullDateObj = new Date(`${dateVal}T${timeVal}`);
    
    // Format Time (AM/PM)
    const formattedTime = fullDateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    // Format Date (Jan 01)
    const formattedDate = fullDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Push to array
    meetings.push({
        title,
        candidate,
        link,
        fullDateObj,
        formattedTime,
        formattedDate
    });

    // 4. Google Calendar Integration
    const endObj = new Date(fullDateObj.getTime() + 60 * 60000); // Add 1 Hour
    function formatGCal(d) { return d.toISOString().replace(/[-:]|\.\d+/g, ""); }
    
    // We put the meeting link in the 'Location' field so it's clickable
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCal(fullDateObj)}/${formatGCal(endObj)}&details=${encodeURIComponent("Attendee: " + candidate + "\nLink: " + link)}&location=${encodeURIComponent(link)}&sf=true&output=xml`;
    
    window.open(gCalUrl, '_blank');

    // Reset & Close
    renderMeetings();
    closeModal();
    
    // Clear inputs
    document.getElementById('intTitle').value = '';
    document.getElementById('intCandidate').value = '';
    document.getElementById('intLink').value = '';
    // Leave date/time as is for convenience or clear them too
}

// Modal Controls
const modal = document.getElementById('scheduleModal');
function openModal() { modal.style.display = 'flex'; }
function closeModal() { modal.style.display = 'none'; }

// Initial call
renderMeetings();