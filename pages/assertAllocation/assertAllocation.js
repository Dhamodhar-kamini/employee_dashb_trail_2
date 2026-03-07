// --- 1. Dummy Data ---
let hraAssets = [
    { id: 'AST-001', employee: 'Sarah Jenkins', type: 'Laptop', model: 'Dell XPS 15', date: '2023-10-15', status: 'assigned' },
    { id: 'AST-002', employee: 'Mike Ross', type: 'Monitor', model: 'Dell UltraSharp 27', date: '2023-11-01', status: 'assigned' },
    { id: 'AST-003', employee: 'Rachel Zane', type: 'Phone', model: 'iPhone 13 Work', date: '2023-09-20', status: 'maintenance' },
    { id: 'AST-004', employee: 'Louis Litt', type: 'Laptop', model: 'MacBook Pro 16', date: '2023-08-10', status: 'returned' },
    { id: 'AST-005', employee: 'Harvey Specter', type: 'Laptop', model: 'MacBook Air M2', date: '2023-10-05', status: 'assigned' }
];

// --- 2. Element Selectors ---
const hraTableBody = document.getElementById('hraAssetTableBody');
const hraModal = document.getElementById('hraAssetModal');
const hraAddBtn = document.getElementById('hraAddAssetBtn');
const hraCloseBtn = document.getElementById('hraCloseModal');
const hraAssetForm = document.getElementById('hraAssetForm');
const hraSearchInput = document.getElementById('hraSearchInput');
const hraSidebar = document.getElementById('hraSidebar');
const hraMenuToggle = document.getElementById('hraMenuToggle');
const hraSuccessPopup = document.getElementById('hraSuccessPopup'); // New Popup

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
                <button class="hra-action-icon" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="hra-action-icon" title="Return" style="color: #ef4444;"><i class="fa-solid fa-rotate-left"></i></button>
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
    hraModal.style.display = 'flex';
});

// Close Modal
hraCloseBtn.addEventListener('click', () => {
    hraModal.style.display = 'none';
});

// Close Modal Outside Click
window.addEventListener('click', (e) => {
    if (e.target == hraModal) {
        hraModal.style.display = 'none';
    }
});

// Form Submission
hraAssetForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    // 1. Get Values
    const newAsset = {
        id: document.getElementById('hraAssetId').value,
        employee: document.getElementById('hraEmpName').value,
        type: document.getElementById('hraAssetType').value,
        model: document.getElementById('hraModelDetails').value,
        date: document.getElementById('hraAssignDate').value,
        status: 'assigned'
    };

    // 2. Add to Array
    hraAssets.unshift(newAsset);
    
    // 3. Update Table
    hraRenderTable(hraAssets);
    
    // 4. Close Modal & Reset Form
    hraModal.style.display = 'none';
    hraAssetForm.reset();

    // 5. SHOW SUCCESS POPUP
    showSuccessPopup();
});

// Search Filter
hraSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = hraAssets.filter(asset => 
        asset.employee.toLowerCase().includes(term) || 
        asset.id.toLowerCase().includes(term) ||
        asset.model.toLowerCase().includes(term)
    );
    hraRenderTable(filtered);
});

// Mobile Sidebar Toggle
hraMenuToggle.addEventListener('click', () => {
    hraSidebar.classList.toggle('hra-active');
});