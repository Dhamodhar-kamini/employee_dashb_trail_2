// --- 1. Dummy Data ---
let hraAssets = [
    { id: 'AST-001', empId: 'EMP-001', employee: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', type: 'Laptop', model: 'Dell XPS 15', date: '2023-10-15', status: 'assigned' },
    { id: 'AST-002', empId: 'EMP-002', employee: 'Mike Ross', email: 'mike.ross@example.com', type: 'Monitor', model: 'Dell UltraSharp 27', date: '2023-11-01', status: 'assigned' },
    { id: 'AST-003', empId: 'EMP-003', employee: 'Rachel Zane', email: 'rachel.zane@example.com', type: 'Phone', model: 'iPhone 13 Work', date: '2023-09-20', status: 'maintenance' },
    { id: 'AST-004', empId: 'EMP-004', employee: 'Louis Litt', email: 'louis.litt@example.com', type: 'Laptop', model: 'MacBook Pro 16', date: '2023-08-10', status: 'returned' },
    { id: 'AST-005', empId: 'EMP-005', employee: 'Harvey Specter', email: 'harvey.specter@example.com', type: 'Laptop', model: 'MacBook Air M2', date: '2023-10-05', status: 'assigned' }
];

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
            <td style="font-weight:bold;">${asset.id}</td>
            <td>${asset.employee}</td>
            <td><i class="fa-solid ${hraGetIcon(asset.type)}"></i> ${asset.type}</td>
            <td>${asset.model}</td>
            <td>${asset.date}</td>
            <td><span class="hra-status-badge hra-status-${asset.status}">${asset.status}</span></td>
            <td>
                <button class="hra-action-icon hra-edit-btn" data-id="${asset.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="hra-action-icon hra-delete-btn" data-id="${asset.id}" title="Delete" style="color: #ef4444;"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        hraTableBody.appendChild(tr);
    });
}

function hraGetIcon(type) {
    switch(type.toLowerCase()) {
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
        asset.id.toLowerCase().includes(term) ||
        asset.model.toLowerCase().includes(term)
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
    currentEditingAssetId = asset.id;
    hraModalTitle.textContent = 'Edit Asset Details';
    hraModalSubmitBtn.textContent = 'Save Changes';

    document.getElementById('hraEmpId').value = asset.empId || '';
    document.getElementById('hraEmpName').value = asset.employee;
    document.getElementById('hraEmpEmail').value = asset.email || '';
    document.getElementById('hraAssetType').value = asset.type;
    document.getElementById('hraModelDetails').value = asset.model;
    document.getElementById('hraAssetId').value = asset.id;
    document.getElementById('hraAssignDate').value = asset.date;

    hraModal.style.display = 'flex';
}

function hraOpenModalForEdit(asset) {
    currentEditingAssetId = asset.id;
    hraModalTitle.textContent = 'Edit Asset Details';
    hraModalSubmitBtn.textContent = 'Save Changes';

    document.getElementById('hraEmpName').value = asset.employee;
    document.getElementById('hraEmpEmail').value = asset.email || '';
    document.getElementById('hraAssetType').value = asset.type;
    document.getElementById('hraModelDetails').value = asset.model;
    document.getElementById('hraAssetId').value = asset.id;
    document.getElementById('hraAssignDate').value = asset.date;

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
document.addEventListener('DOMContentLoaded', () => {
    hraRenderTable(hraAssets);
});

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

// Table Action Buttons (Edit/Delete)
hraTableBody.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const assetId = button.getAttribute('data-id');
    if (!assetId) return;

    // Edit
    if (button.classList.contains('hra-edit-btn')) {
        const asset = hraAssets.find(a => a.id === assetId);
        if (!asset) return;
        hraOpenModalForEdit(asset);
        return;
    }

    // Delete
    if (button.classList.contains('hra-delete-btn')) {
        hraAssets = hraAssets.filter(a => a.id !== assetId);
        hraRenderTable(hraGetFilteredAssets());
        showSuccessPopup();
        return;
    }
});

// Form Submission
hraAssetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedAsset = {
        id: document.getElementById('hraAssetId').value,
        empId: document.getElementById('hraEmpId').value,
        employee: document.getElementById('hraEmpName').value,
        email: document.getElementById('hraEmpEmail').value,
        type: document.getElementById('hraAssetType').value,
        model: document.getElementById('hraModelDetails').value,
        date: document.getElementById('hraAssignDate').value,
        status: 'assigned'
    };

    if (currentEditingAssetId) {
        const idx = hraAssets.findIndex(a => a.id === currentEditingAssetId);
        if (idx !== -1) {
            hraAssets[idx] = updatedAsset;
        }
    } else {
        hraAssets.unshift(updatedAsset);
    }

    hraRenderTable(hraGetFilteredAssets());

    hraCloseModal();

    showSuccessPopup();
});

// Search Filter
hraSearchInput.addEventListener('input', () => {
    hraRenderTable(hraGetFilteredAssets());
});

// Mobile Sidebar Toggle
hraMenuToggle.addEventListener('click', () => {
    hraSidebar.classList.toggle('hra-active');
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