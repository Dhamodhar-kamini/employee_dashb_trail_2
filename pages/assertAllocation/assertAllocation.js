let hraAssets = [];

// --- 2. Element Selectors ---
const hraTableBody = document.getElementById('hraAssetTableBody');
const hraModal = document.getElementById('hraAssetModal');
const hraModalTitle = document.getElementById('hraModalTitle');
const hraModalSubmitBtn = document.getElementById('hraModalSubmitBtn');
const hraAddBtn = document.getElementById('hraAddAssetBtn');
const hraCloseBtn = document.getElementById('hraCloseModal');
const hraAssetForm = document.getElementById('hraAssetForm');
const hraSearchInput = document.getElementById('hraSearchInput');
const hraSidebar = document.getElementById('hraSidebar');
const hraMenuToggle = document.getElementById('hraMenuToggle');
const hraSuccessPopup = document.getElementById('hraSuccessPopup'); // New Popup

let currentEditingAssetId = null;

// --- 3. Core Functions ---

function hraRenderTable(data) {
    hraTableBody.innerHTML = '';

    if (data.length === 0) {
        hraTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No assets found.</td></tr>';
        return;
    }

    data.forEach(asset => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
<td style="font-weight:bold;">${asset.asset_id}</td>
<td>${asset.emp_id}</td>
<td>${asset.employee}</td>
<td><i class="fa-solid ${hraGetIcon(asset.asset_type)}"></i> ${asset.asset_type}</td>
<td>${asset.model_details}</td>
<td>${asset.assigned_date}</td>

<td>
<span class="hra-status-badge hra-status-${asset.status}">
${asset.status}
</span>
</td>

<td>
<button class="hra-action-icon hra-edit-btn" data-id="${asset.asset_id}">
<i class="fa-solid fa-pen"></i>
</button>

<button class="hra-action-icon hra-delete-btn" data-id="${asset.asset_id}" style="color:#ef4444;">
<i class="fa-solid fa-trash"></i>
</button>
</td>
`;
        hraTableBody.appendChild(tr);
    });
}

function hraGetIcon(type) {

    if (!type) return "fa-box";

    switch (type.toLowerCase()) {
        case 'laptop': return 'fa-laptop';
        case 'monitor': return 'fa-desktop';
        case 'phone': return 'fa-mobile-screen';
        case 'headset': return 'fa-headphones';
        default: return 'fa-box';
    }
}

function hraGetFilteredAssets() {
    const term = hraSearchInput.value.toLowerCase().trim();
    if (!term) return hraAssets;

    return hraAssets.filter(asset =>
        asset.employee.toLowerCase().includes(term) ||
        asset.asset_id.toLowerCase().includes(term) ||
        asset.model_details.toLowerCase().includes(term)
    );
}

function hraOpenModalForCreate() {
    currentEditingAssetId = null;
    hraModalTitle.textContent = 'Allocate New Asset';
    hraModalSubmitBtn.textContent = 'Confirm Allocation';
    hraAssetForm.reset();
    document.getElementById('hraEmpId').value = '';
    document.getElementById('hraEmpEmail').value = '';
    hraModal.style.display = 'flex';
}

function hraOpenModalForEdit(asset) {
    currentEditingAssetId = asset.asset_id;
    hraModalTitle.textContent = 'Edit Asset Details';
    hraModalSubmitBtn.textContent = 'Save Changes';

    document.getElementById('hraEmpId').value = asset.empId || '';
    document.getElementById('hraEmpName').value = asset.employee;
    document.getElementById('hraEmpEmail').value = asset.email || '';
    document.getElementById('hraAssetType').value = asset.asset.type;
    document.getElementById('hraModelDetails').value = asset.model_details;
    document.getElementById('hraAssetId').value = asset.asset.id;
    document.getElementById('hraAssignDate').value = asset.assigned_date;

    hraModal.style.display = 'flex';
}

function hraCloseModal() {
    currentEditingAssetId = null;
    hraModal.style.display = 'none';
    hraModalTitle.textContent = 'Allocate New Asset';
    hraModalSubmitBtn.textContent = 'Confirm Allocation';
    hraAssetForm.reset();
}

// Function to Show Success Popup
function showSuccessPopup() {
    hraSuccessPopup.classList.add('hra-show');
    // Hide after 3 seconds
    setTimeout(() => {
        hraSuccessPopup.classList.remove('hra-show');
    }, 3000);
}

// --- 4. Event Listeners ---

// Initial Load
document.addEventListener('DOMContentLoaded',()=>{ loadAssets(),loadReturnAssets()});

// Open Modal
hraAddBtn.addEventListener('click', () => {
    hraOpenModalForCreate();
});

// Close Modal
hraCloseBtn.addEventListener('click', () => {
    hraCloseModal();
});

// Close Modal Outside Click
window.addEventListener('click', (e) => {
    if (e.target == hraModal) {
        hraCloseModal();
    }
});

// Table Action Buttons (Edit/Delete/Return)
hraTableBody.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const assetId = button.getAttribute('data-id');
    if (!assetId) return;

    // Edit
    if (button.classList.contains('hra-edit-btn')) {
        const asset = hraAssets.find(a => a.asset_id === assetId);
        if (!asset) return;
        hraOpenModalForEdit(asset);
        return;
    }

    // Delete
    if (button.classList.contains('hra-delete-btn')) {
        hraAssets = hraAssets.filter(a => a.asset_id !== assetId);
        hraRenderTable(hraGetFilteredAssets());
        showSuccessPopup();
        return;
    }


});

hraAssetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const assetData = {
        asset_id: document.getElementById('hraAssetId').value,
        emp_id: document.getElementById('hraEmpId').value,
        employee: document.getElementById('hraEmpName').value,
        email: document.getElementById('hraEmpEmail').value,
        asset_type: document.getElementById('hraAssetType').value,
        model_details: document.getElementById('hraModelDetails').value,
        assigned_date: document.getElementById('hraAssignDate').value,
        status: "assigned"
    };

    try {

        const response = await fetch("http://127.0.0.1:8000/api/assets/save/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(assetData)
        });

        const result = await response.json();
        console.log("Saved:", result);

        if (response.ok) {

            loadAssets(); // reload table from backend

            hraCloseModal();

            showSuccessPopup();
        }

    } catch (error) {
        console.error("Error saving asset:", error);
    }
});

async function loadAssets() {

    try {

        const response = await fetch("http://127.0.0.1:8000/api/assets/");
        const data = await response.json();

        hraAssets = data;

        hraRenderTable(hraAssets);

    } catch (error) {

        console.error("Error loading assets:", error);
    }
}
// Search Filter
hraSearchInput.addEventListener('input', () => {
    hraRenderTable(hraGetFilteredAssets());
});

// Mobile Sidebar Toggle
hraMenuToggle.addEventListener('click', () => {
    hraSidebar.classList.toggle('hra-active');
});

// --- RETURN ASSETS FUNCTIONALITY ---

// Return Assets Data Storage
let hraReturnAssets = [];
let currentReturningAsset = null; // Track which asset is being returned

// Return Assets Element Selectors
const hraReturnTableBody = document.getElementById('hraReturnTableBody');
const hraReturnModal = document.getElementById('hraReturnModal');
const hraReturnForm = document.getElementById('hraReturnForm');
const hraReturnSearchInput = document.getElementById('hraReturnSearchInput');
const hraReturnCloseModal = document.getElementById('hraReturnCloseModal');

// Function to render Return Assets Table
function hraRenderReturnTable(data) {
    hraReturnTableBody.innerHTML = '';

    if (data.length === 0) {
        hraReturnTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No returned assets yet.</td></tr>';
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.employee_name}</td>
<td><i class="fa-solid ${hraGetIcon(item.asset_type)}"></i> ${item.asset_type}</td>
<td><span class="hra-status-badge hra-status-${item.condition.toLowerCase()}">${item.condition}</span></td>
<td>${item.description}</td>
        `;
        hraReturnTableBody.appendChild(tr);
    });
}

// Function to filter returned assets by search
function hraGetFilteredReturnAssets() {
    const term = hraReturnSearchInput.value.toLowerCase().trim();
    if (!term) return hraReturnAssets;

    return hraReturnAssets.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.assetId.toLowerCase().includes(term)
    );
}

// Close Return Modal
function hraCloseReturnModal() {
    hraReturnModal.style.display = 'none';
    hraReturnForm.reset();
}

// Return Return Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Close Return Modal
    hraReturnCloseModal.addEventListener('click', () => {
        hraCloseReturnModal();
    });

    // Close Return Modal Outside Click
    window.addEventListener('click', (e) => {
        if (e.target == hraReturnModal) {
            hraCloseReturnModal();
        }
    });

    // Return Form Submission
    hraReturnForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const condition = document.getElementById('hraReturnCondition').value;
        const reason = document.getElementById('hraReturnReason').value;

        if (!condition || !reason) {
            alert('Please fill in all fields');
            return;
        }

        if (!currentReturningAsset) return;

        // Update asset status
        currentReturningAsset.status = 'returned';

        // Add to return assets
        const returnData = {
            id: Date.now(),
            name: currentReturningAsset.employee,
            assetType: currentReturningAsset.type,
            assetId: currentReturningAsset.id,
            condition: condition,
            reason: reason,
            returnDate: new Date().toISOString().split('T')[0]
        };

        hraReturnAssets.push(returnData);
        hraRenderReturnTable(hraGetFilteredReturnAssets());
        hraRenderTable(hraGetFilteredAssets());
        hraCloseReturnModal();
        currentReturningAsset = null;
        showSuccessPopup();
    });

    // Return Table Delete Button
    hraReturnTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const returnId = button.getAttribute('data-id');
        if (!returnId) return;

        if (button.classList.contains('hra-return-delete-btn')) {
            hraReturnAssets = hraReturnAssets.filter(a => a.id != returnId);
            hraRenderReturnTable(hraGetFilteredReturnAssets());
            showSuccessPopup();
            return;
        }
    });

    // Return Search Filter
    hraReturnSearchInput.addEventListener('input', () => {
        hraRenderReturnTable(hraGetFilteredReturnAssets());
    });

    // Initial render of empty return table
    hraRenderReturnTable(hraReturnAssets);
});

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

async function loadReturnAssets(){

    try{

        const response = await fetch("http://127.0.0.1:8000/api/return-assets/");
        const data = await response.json();

        hraReturnAssets = data;

        hraRenderReturnTable(hraReturnAssets);

    }catch(error){

        console.error("Error loading return assets:", error);
    }

}