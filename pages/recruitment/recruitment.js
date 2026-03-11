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


//position cards
 // --- 1. Data Store (Complex Objects) ---
const dashboardData = {
  positions: {
    color: '#f97316',
    title: 'Open Positions',
    // Simple strings for positions, objects for others
    items: [
      { title: 'Senior React Developer' },
      { title: 'UI/UX Designer' },
      { title: 'Backend Node.js Lead' }
    ]
  },
  candidates: {
    color: '#f97316',
    title: 'Total Candidates',
    items: [
      { name: 'Arya', email: 'arya@example.com', job: 'React Developer', status: 'Interested' },
      { name: 'Arjun', email: 'arjun@example.com', job: 'UI Designer', status: 'Screening' },
      { name: 'Prasad', email: 'prasad@example.com', job: 'Backend Lead', status: 'Not Interested' }
    ]
  },
  interviews: {
    color: '#f97316',
    title: 'Interviews Today',
    items: [
      { name: 'Arya', job: 'React Developer', email: 'arya@example.com', date: '2023-10-25', time: '10:00' },
      { name: 'Priya', job: 'HR Manager', email: 'priya@example.com', date: '2023-10-25', time: '14:00' }
    ]
  },
  offers: {
    color: '#f97316',
    title: 'Offers Released',
    items: [
      { name: 'Rachel Zane', job: 'Legal Counsel', interviewDate: '2023-10-20', offerSent: true },
      { name: 'Louis Litt', job: 'Finance Head', interviewDate: '2023-10-22', offerSent: false }
    ]
  }
};

let currentKey = null; // 'positions', 'candidates', 'interviews', or 'offers'

// --- 2. Initialize Dashboard Counts ---
function updateDashboardCounts() {
  document.getElementById('count-positions').innerText = dashboardData.positions.items.length;
  // Candidates: 81 (base) + dynamic count
  document.getElementById('count-candidates').innerText = 81 + dashboardData.candidates.items.length;
  document.getElementById('count-interviews').innerText = dashboardData.interviews.items.length;
  document.getElementById('count-offers').innerText = dashboardData.offers.items.length;
}

// --- 3. Open Main Modal ---
function openMainModal(key) {
  currentKey = key;
  const data = dashboardData[key];
  
  // Style Header
  const header = document.getElementById('modalHeader');
  header.style.backgroundColor = data.color;
  document.getElementById('modalTitle').innerText = data.title;

  hideForm(); // Ensure form is hidden initially
  renderList(); // Show list of items
  
  document.getElementById('mainModal').classList.add('active');
}

function closeMainModal() {
  document.getElementById('mainModal').classList.remove('active');
  currentKey = null;
}

// --- 4. Render Lists (Different Layouts per Card) ---
function renderList() {
  const container = document.getElementById('listContainer');
  container.innerHTML = '';
  const items = dashboardData[currentKey].items;

  if (items.length === 0) {
    container.innerHTML = '<div style="text-align:center; color:#999;">No items found.</div>';
    return;
  }

  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'rd-list-item';

    let contentHTML = '';
    let actionsHTML = `
      <div class="rd-actions">
        <button class="rd-btn rd-btn-edit" onclick="editItem(${index})"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="rd-btn rd-btn-delete" onclick="deleteItem(${index})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    // --- Template Logic Based on Key ---
    if (currentKey === 'positions') {
      contentHTML = `<div class="rd-item-details"><div class="rd-item-title">${item.title}</div></div>`;
    } 
    else if (currentKey === 'candidates') {
      let badgeClass = item.status === 'Interested' ? 'rd-badge-green' : (item.status === 'Not Interested' ? 'rd-badge-red' : 'rd-badge-blue');
      contentHTML = `
        <div class="rd-item-details">
          <div class="rd-item-title">${item.name} <span class="rd-badge ${badgeClass}">${item.status}</span></div>
          <div class="rd-item-sub">${item.job} | ${item.email}</div>
        </div>`;
    } 
    else if (currentKey === 'interviews') {
      contentHTML = `
        <div class="rd-item-details">
          <div class="rd-item-title">${item.name} - ${item.time}</div>
          <div class="rd-item-sub">Role: ${item.job} | Date: ${item.date}</div>
          <div class="rd-item-sub">${item.email}</div>
        </div>`;
    } 
    else if (currentKey === 'offers') {
      let offerBtn = item.offerSent 
        ? `<span class="rd-badge rd-badge-green"><i class="fa-solid fa-check"></i> Offer Sent</span>` 
        : `<button class="rd-btn rd-btn-primary" onclick="sendOffer(${index})">Send Offer</button>`;
        
      contentHTML = `
        <div class="rd-item-details">
          <div class="rd-item-title">${item.name}</div>
          <div class="rd-item-sub">Role: ${item.job} | Interviewed: ${item.interviewDate}</div>
          <div style="margin-top:5px;">${offerBtn}</div>
        </div>`;
    }

    div.innerHTML = contentHTML + actionsHTML;
    container.appendChild(div);
  });
}

// --- 5. Form Handling (Add/Edit) ---
function showAddForm() {
  document.getElementById('formTitle').innerText = "Add New Item";
  document.getElementById('editIndex').value = "-1"; // -1 indicates ADD mode
  injectFormFields();
  document.getElementById('dynamicForm').classList.add('active');
  // Scroll to bottom
  document.querySelector('.rd-modal-body').scrollTop = document.querySelector('.rd-modal-body').scrollHeight;
}

function editItem(index) {
  document.getElementById('formTitle').innerText = "Edit Item";
  document.getElementById('editIndex').value = index;
  injectFormFields(dashboardData[currentKey].items[index]);
  document.getElementById('dynamicForm').classList.add('active');
  // Scroll to bottom
  document.querySelector('.rd-modal-body').scrollTop = document.querySelector('.rd-modal-body').scrollHeight;
}

function hideForm() {
  document.getElementById('dynamicForm').classList.remove('active');
}

// Inject Fields based on Card Type
function injectFormFields(data = {}) {
  const container = document.getElementById('formFields');
  let fieldsHTML = '';

  if (currentKey === 'positions') {
    fieldsHTML = `
      <div class="form-group"><label>Job Title</label><input type="text" id="inp_title" value="${data.title || ''}"></div>
    `;
  } 
  else if (currentKey === 'candidates') {
    fieldsHTML = `
      <div class="form-group"><label>Candidate Name</label><input type="text" id="inp_name" value="${data.name || ''}"></div>
      <div class="form-group"><label>Email</label><input type="email" id="inp_email" value="${data.email || ''}"></div>
      <div class="form-group"><label>Job Applied For</label><input type="text" id="inp_job" value="${data.job || ''}"></div>
      <div class="form-group"><label>Status</label>
        <select id="inp_status">
          <option value="Interested" ${data.status === 'Interested' ? 'selected' : ''}>Interested</option>
          <option value="Screening" ${data.status === 'Screening' ? 'selected' : ''}>Screening</option>
          <option value="Not Interested" ${data.status === 'Not Interested' ? 'selected' : ''}>Not Interested</option>
        </select>
      </div>
    `;
  }
  else if (currentKey === 'interviews') {
    fieldsHTML = `
      <div class="form-group"><label>Candidate Name</label><input type="text" id="inp_name" value="${data.name || ''}"></div>
      <div class="form-group"><label>Job Role</label><input type="text" id="inp_job" value="${data.job || ''}"></div>
      <div class="form-group"><label>Email</label><input type="email" id="inp_email" value="${data.email || ''}"></div>
      <div class="form-group"><label>Interview Date</label><input type="date" id="inp_date" value="${data.date || ''}"></div>
      <div class="form-group"><label>Interview Time</label><input type="time" id="inp_time" value="${data.time || ''}"></div>
    `;
  }
  else if (currentKey === 'offers') {
    fieldsHTML = `
      <div class="form-group"><label>Candidate Name</label><input type="text" id="inp_name" value="${data.name || ''}"></div>
      <div class="form-group"><label>Job Role</label><input type="text" id="inp_job" value="${data.job || ''}"></div>
      <div class="form-group"><label>Interview Completed Date</label><input type="date" id="inp_date" value="${data.interviewDate || ''}"></div>
      <div class="form-group"><label>Offer Status</label>
        <select id="inp_sent">
          <option value="false" ${!data.offerSent ? 'selected' : ''}>Not Sent</option>
          <option value="true" ${data.offerSent ? 'selected' : ''}>Sent</option>
        </select>
      </div>
    `;
  }

  container.innerHTML = fieldsHTML;
}

// --- 6. Save Data (Add or Update) ---
function saveData() {
  const index = parseInt(document.getElementById('editIndex').value);
  const itemsArray = dashboardData[currentKey].items;
  let newItem = {};

  // Construct Object based on Key
  if (currentKey === 'positions') {
    newItem = { title: document.getElementById('inp_title').value };
  } 
  else if (currentKey === 'candidates') {
    newItem = {
      name: document.getElementById('inp_name').value,
      email: document.getElementById('inp_email').value,
      job: document.getElementById('inp_job').value,
      status: document.getElementById('inp_status').value
    };
  }
  else if (currentKey === 'interviews') {
    newItem = {
      name: document.getElementById('inp_name').value,
      job: document.getElementById('inp_job').value,
      email: document.getElementById('inp_email').value,
      date: document.getElementById('inp_date').value,
      time: document.getElementById('inp_time').value
    };
  }
  else if (currentKey === 'offers') {
    newItem = {
      name: document.getElementById('inp_name').value,
      job: document.getElementById('inp_job').value,
      interviewDate: document.getElementById('inp_date').value,
      offerSent: document.getElementById('inp_sent').value === 'true'
    };
  }

  // Validate basic
  if (!Object.values(newItem).every(val => val !== '')) {
    alert("Please fill in all fields.");
    return;
  }

  if (index === -1) {
    // Add New
    itemsArray.push(newItem);
  } else {
    // Update Existing
    itemsArray[index] = newItem;
  }

  hideForm();
  renderList();
  updateDashboardCounts();
}

// --- 7. Delete Logic ---
function deleteItem(index) {
  if (confirm("Are you sure?")) {
    dashboardData[currentKey].items.splice(index, 1);
    renderList();
    updateDashboardCounts();
  }
}

// --- 8. Specific Logic for Offers (Send Button) ---
function sendOffer(index) {
  if (confirm("Mark offer letter as sent?")) {
    dashboardData.offers.items[index].offerSent = true;
    renderList();
  }
}

// Initial Load
updateDashboardCounts();


//logout section
/* --- Toggle Profile Dropdown --- */
function hdr_toggleProfilePopup() {
    const dropdown = document.getElementById("hdrProfileDropdown");
    dropdown.classList.toggle("show");
}

/* --- Show Logout Modal --- */
function hdr_showLogoutModal() {
    // 1. Hide the dropdown menu first (optional UI polish)
    const dropdown = document.getElementById("hdrProfileDropdown");
    if (dropdown) dropdown.classList.remove("show");

    // 2. Show the modal
    const modal = document.getElementById("hdrLogoutModal");
    if (modal) modal.classList.add("show-modal");
}

/* --- Hide Logout Modal --- */
function hdr_hideLogoutModal() {
    const modal = document.getElementById("hdrLogoutModal");
    if (modal) modal.classList.remove("show-modal");
}

/* --- Perform Actual Logout --- */
function hdr_confirmLogout() {
    // 1. Clear session/local storage
    sessionStorage.clear();
    localStorage.clear();

    // 2. Redirect to Login Page
    window.location.href = "../adminlogin/adminlogin.html";
}

/* --- Close Dropdown when clicking outside --- */
window.onclick = function(event) {
    // If click is NOT on the profile wrapper
    if (!event.target.closest(".hdr-profile-wrapper")) {
        const dropdown = document.getElementById("hdrProfileDropdown");
        if (dropdown && dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
        }
    }

    // Optional: Close modal if clicking on the overlay background
    const modal = document.getElementById("hdrLogoutModal");
    if (event.target === modal) {
        hdr_hideLogoutModal();
    }
}