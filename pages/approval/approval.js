// Dashboard Dropdown Toggle
document.getElementById("dashboardMenu").onclick = function () {
    this.classList.toggle("open");
    document.getElementById("dashboardSubmenu").classList.toggle("open");
};

document.addEventListener('DOMContentLoaded', () => {

    // Global variables to store data for Search/Filtering (Optional, added so search doesn't crash)
    let globalAssetData = [];
    
    // ==========================================
    // 1. LEAVES SECTION (Keep as is, but added safety check)
    // ==========================================
    const leaveTableBody = document.getElementById('leaveTableBody');

    // Define Global Action Functions for Leaves
    window.approveLeave = function(id) {
        fetch(`http://13.60.26.193:8000/api/employee/update/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "approved" })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to approve");
            return res.json();
        })
        .then(() => {
            location.reload(); // Reload page to see changes
        })
        .catch(err => console.error("Approve error:", err));
    };

    window.rejectLeave = function(id) {
        fetch(`http://13.60.26.193:8000/api/employee/update/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "rejected" })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to reject");
            return res.json();
        })
        .then(() => {
            location.reload(); // Reload page to see changes
        })
        .catch(err => console.error("Reject error:", err));
    }

    // Fetch Leaves
    fetch(`http://13.60.26.193:8000/api/leave-approvals/`) // Added :8000 assuming port is needed based on other calls
    .then(res => res.json())
    .then(response => {
        const data = response.data || response; // Handle if response is array or object
        leaveTableBody.innerHTML = "";

        if (!data || data.length === 0) {
            leaveTableBody.innerHTML = `<tr><td colspan="6">No leaves found</td></tr>`;
            return;
        }

        data.forEach(p => {
            const actionHtml = `
                <div class="action-cell">
                    <button class="btn-action-reject" onclick="rejectLeave(${p.id})">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <button class="btn-action-approve" onclick="approveLeave(${p.id})">
                        <i class="fa-solid fa-check"></i> Approve
                    </button>
                </div>
            `;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${p.name}</td>
                <td>${p.details || p.leave_type || '-'}</td>
                <td>${p.duration || '-'}</td>
                <td>${p.reason}</td>
                <td>${p.days || '-'}</td>
                <td>${actionHtml}</td>
            `;
            leaveTableBody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Error fetching leaves:", err);
        leaveTableBody.innerHTML = `<tr><td colspan="6">Failed to load leaves</td></tr>`;
    });


    // ==========================================
    // 2. ASSETS SECTION (Fixed URL and Logic)
    // ==========================================

    // ==========================================
// FIXED ASSETS SECTION
// ==========================================

async function loadAssetRequests() {
    const tbody = document.getElementById("assetsTableBody");
    
    // IP Address Correction (Keep your server IP)
    const API_URL = "http://13.60.26.193:8000/api/asset-requests/"; 

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        tbody.innerHTML = ""; 

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No asset requests found</td></tr>`;
            return;
        }

        data.forEach(req => {
            let actionHtml = "";
            
            // --- FIX 1: NORMALIZE STATUS ---
            // Convert whatever comes from DB ("Pending", "pending", "PENDING") to lowercase
            const currentStatus = (req.status || "pending").toLowerCase(); 

            // --- FIX 2: HANDLE EMPLOYEE NAME ---
            // Check employee_name first, then fallback to name, then fallback to "Unknown"
            const employeeName = req.employee_name || req.name || "Unknown Employee";

            if (currentStatus === "pending") {
                actionHtml = `
                <div class="action-cell">
                    <button class="btn-action-reject" onclick="updateAssetStatus(${req.id}, 'rejected')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <button class="btn-action-approve" onclick="updateAssetStatus(${req.id}, 'approved')">
                        <i class="fa-solid fa-check"></i> Approve
                    </button>
                </div>`;
            } else if (currentStatus === "approved") {
                actionHtml = `<span class="status-badge status-approved"><i class="fa-solid fa-circle-check"></i> Approved</span>`;
            } else {
                actionHtml = `<span class="status-badge status-rejected"><i class="fa-solid fa-circle-xmark"></i> Rejected</span>`;
            }

            const row = document.createElement("tr");
            const dateStr = req.date || req.created_at || new Date().toISOString().split('T')[0];

            row.innerHTML = `
                <td><div class="emp-cell"><span>${employeeName}</span></div></td>
                <td>${req.asset_category || req.asset}</td>
                <td>${req.location}</td>
                <td>${dateStr}</td>
                <td><span class="reason-text">${req.description || req.reason}</span></td>
                <td>${actionHtml}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading asset requests:", error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: red;">Failed to load assets.</td></tr>`;
    }
}
    // Corrected Update Function
    window.updateAssetStatus = function (id, status) {
        // FIXED: Added the colon (:) before 8000
        const UPDATE_URL = `http://13.60.26.193:8000/api/asset-request-status/${id}/`;

        fetch(UPDATE_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        })
        .then(data => {
            showToast(status === 'approved' ? "Asset Request Approved" : "Asset Request Rejected");
            loadAssetRequests(); // Refresh table
        })
        .catch(err => {
            console.error("Error updating asset:", err);
        });
    };

    // Helper Toast Function
    function showToast(message) {
        const toast = document.getElementById("toast");
        const toastMsg = document.getElementById("toastMsg");
        if(toastMsg) toastMsg.textContent = message;
        if(toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 3000);
        }
    }

    // ==========================================
    // UI INTERACTION (Tabs, etc)
    // ==========================================

    // Initialize Pages
    loadAssetRequests(); 
    // Removed renderTable() calls because they are replaced by fetch
});

// Tab Switch Logic
function switchTab(tabName, btnElement) {
    const titleMap = {
        leave: "Leaves",
        attendance: "Attendance",
        assets: "Assets"
    };

    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = titleMap[tabName];

    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");

    document.querySelectorAll(".table-responsive").forEach(section => section.classList.add("hidden"));
    
    const target = document.getElementById(tabName + "-section");
    if (target) target.classList.remove("hidden");
}

// Notification Logic
document.addEventListener('DOMContentLoaded', () => {
    const bellBtn = document.getElementById('ntBellBtn');
    const dropdown = document.getElementById('ntDropdown');
    
    if(bellBtn && dropdown) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        window.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
});