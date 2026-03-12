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
    // 2. ASSETS APPROVAL SECTION (UPDATED)
    // ==========================================
    const assetTableBody = document.getElementById("assetsTableBody");

    async function loadAssetRequests() {
        assetTableBody.innerHTML = "";

        try {
            // Fetching from the NEW Admin Endpoint
            const response = await fetch(`http://13.60.26.193/api/admin/asset-requests/`);
            
            if (!response.ok) throw new Error("Failed to fetch asset requests");

            const data = await response.json();

            if (data.length === 0) {
                assetTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No pending asset requests</td></tr>`;
                return;
            }

            data.forEach(req => {
                let actionHtml = "";
                const status = (req.status || "Pending").toLowerCase();
                if (status !== 'pending') return;

                // Logic: Show buttons only if Pending
                if (status === "pending") {
                    actionHtml = `
                    <div class="action-cell">
                        <button class="btn-action-reject" onclick="updateAssetStatus(${req.id}, 'Rejected')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <button class="btn-action-approve" onclick="updateAssetStatus(${req.id}, 'Approved')">
                            <i class="fa-solid fa-check"></i> Approve
                        </button>
                    </div>`;
                } else if (status === "approved") {
                    actionHtml = `<span style="color:green; font-weight:bold;"><i class="fa-solid fa-check"></i> Approved</span>`;
                } else {
                    actionHtml = `<span style="color:red; font-weight:bold;"><i class="fa-solid fa-xmark"></i> Rejected</span>`;
                }

                const row = document.createElement("tr");
                const dateStr = req.created_at ? req.created_at.split('T')[0] : new Date().toISOString().split('T')[0];

                row.innerHTML = `
                    <td>${req.employee_name}</td>
                    <td>${req.asset_category}</td>
                    <td>${req.location}</td>
                    <td>${dateStr}</td>
                    <td>${req.model_detail}</td>
                    <td>${actionHtml}</td>
                `;
                assetTableBody.appendChild(row);
            });

        } catch (error) {
            console.error("Error loading assets:", error);
            assetTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error loading data</td></tr>`;
        }
    }

    // Function to Update Status (Approve/Reject)
    window.updateAssetStatus = function(id, status) {
        if(!confirm(`Mark this request as ${status}?`)) return;

        fetch(`http://13.60.26.193/api/admin/asset-request-status/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        })
        .then(data => {
            alert(data.message);
            loadAssetRequests(); // Refresh Table
        })
        .catch(err => {
            console.error(err);
            alert("Error updating status");
        });
    };

    // Initial Load
    loadAssetRequests();
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