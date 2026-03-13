document.addEventListener("DOMContentLoaded", function () {

    // --- 1. MOCK DATA ---
    let employees = [
        { id: "EMP-001", name: "Dhamodhar Kamini", email: "dhamu@oppty.in", phone: "9876543210", dept: "Engineering", role: "Frontend Dev", type: "Full Time", status: "Active", joinDate: "15 Mar 2020", salary: "₹85,000", location: "Hyderabad", img: "../assets/profiledp.jpeg" },
        { id: "EMP-002", name: "Saleem", email: "saleem@oppty.in", phone: "9876543211", dept: "Design", role: "UI/UX Designer", type: "Full Time", status: "On Leave", joinDate: "10 Apr 2021", salary: "₹75,000", location: "Bangalore", img: "../assets/profiledp.jpeg" },
        { id: "EMP-003", name: "Siddarth", email: "Siddu@oppty.in", phone: "9876543212", dept: "Marketing", role: "SEO Specialist", type: "Contract", status: "Active", joinDate: "22 Jun 2022", salary: "₹45,000", location: "Mumbai", img: "../assets/profiledp.jpeg" },
        { id: "EMP-004", name: "Manikanta", email: "mani@oppty.in", phone: "9876543213", dept: "Engineering", role: "Backend Dev", type: "Full Time", status: "Remote", joinDate: "01 Jan 2023", salary: "₹90,000", location: "Remote", img: "../assets/profiledp.jpeg" },
        { id: "EMP-005", name: "Arjun Kamini", email: "arjun@oppty.in", phone: "9876543214", dept: "HR", role: "HR Manager", type: "Full Time", status: "Active", joinDate: "15 Aug 2019", salary: "₹1,00,000", location: "Hyderabad", img: "../assets/profiledp.jpeg" },
        { id: "EMP-006", name: "Nani", email: "nani@oppty.in", phone: "9876543215", dept: "Engineering", role: "QA Tester", type: "Internship", status: "Active", joinDate: "01 Sep 2023", salary: "₹15,000", location: "Chennai", img: "../assets/profiledp.jpeg" }
    ];

    // --- 2. DOM ELEMENTS ---
    const tableBody = document.getElementById("employeeTableBody");
    
    // Filter Inputs
    const searchInput = document.getElementById("searchInput");
    const deptFilter = document.getElementById("deptFilter");
    const statusFilter = document.getElementById("statusFilter");
    const empFilter = document.getElementById("empFilter"); // NEW: Get the Type filter
    const downloadBtn = document.getElementById("downloadBtn"); 
    
    // Main Form Modal Elements
    const modal = document.getElementById("employeeModal");
    const modalTitle = document.querySelector(".modal-header h2");
    const employeeForm = document.getElementById("empForm"); 
    const submitBtn = document.querySelector(".btn-submit");
    const addBtn = document.getElementById("addEmployeeBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");

    // Success Modal Elements
    const successModal = document.getElementById("successModal");
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");
    const successTitle = document.getElementById("successTitle");
    const successMessage = document.getElementById("successMessage");

    // Delete Modal Elements
    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const deleteEmpName = document.getElementById("deleteEmpName");

    // State Variables
    let isEditMode = false;
    let currentEditId = null;
    let deleteTargetId = null;

    // --- 3. HELPER: SUCCESS POPUP ---
    function showSuccess(title, msg) {
        if(successTitle) successTitle.innerText = title;
        if(successMessage) successMessage.innerText = msg;
        if(successModal) successModal.classList.add("active");
    }

    if(closeSuccessBtn) {
        closeSuccessBtn.addEventListener("click", () => {
            successModal.classList.remove("active");
        });
    }


    function renderTable() 
    {
        if (!tableBody) return;
        tableBody.innerHTML = "";
        fetch("http://127.0.0.1:8000/api/employees/")
        .then(res => res.json())
        .then(data => 
          {
            console.log("Data fetched:", data);

        data.forEach(emp => 
            {
            let statusClass = "status-active";
            let icon = "fa-check";
            const row = `
                <tr>
                    <td>
                        <div class="user-cell">
                           
                            <div class="user-info">
                                <span class="user-name view-profile-btn" data-id="${emp.id}" 
                                      style="cursor:pointer; color:#FF5B1E; font-weight:600;">
                                    ${emp.name}
                                </span>
                                <span class="user-email">${emp.email}</span>
                            </div>
                        </div>
                    </td>
                    <td>EMP-${emp.id}</td>
                    <td>Development-${emp.department}</td>
                    <td>${emp.role}</td>
                    <td>${emp.full_time}</td>
                    <td><span class="status-pill ${statusClass}"><i class="fa-solid ${icon}"></i> ${emp.status}</span></td>
                    <td>
                        <div class="action-menu">
                            <button class="btn-action edit-btn" data-id="${emp.id}" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button class="btn-action delete-btn" data-id="${emp.id}" title="Delete" style="color:#FF5B5B;"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    )
    })
}     
   

    // --- 4. RENDER TABLE ---
    // function renderTable(data) {
    //     if (!tableBody) return;
    //     tableBody.innerHTML = "";

    //     if (data.length === 0) {
    //         tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color:#999;">No employees found.</td></tr>`;
    //         return;
    //     }

    //     data.forEach(emp => {
    //         let statusClass = "status-active";
    //         let icon = "fa-check";

    //         if (emp.status === "On Leave") { statusClass = "status-leave"; icon = "fa-clock"; }
    //         else if (emp.status === "Remote") { statusClass = "status-remote"; icon = "fa-house-laptop"; }

    //         const row = `
    //             <tr>
    //                 <td>
    //                     <div class="user-cell">
    //                         <img src="${emp.img}" alt="u">
    //                         <div class="user-info">
    //                             <span class="user-name view-profile-btn" data-id="${emp.id}" 
    //                                   style="cursor:pointer; color:#FF5B1E; font-weight:600;">
    //                                 ${emp.name}
    //                             </span>
    //                             <span class="user-email">${emp.email}</span>
    //                         </div>
    //                     </div>
    //                 </td>
    //                 <td>${emp.id}</td>
    //                 <td>${emp.dept}</td>
    //                 <td>${emp.role}</td>
    //                 <td>${emp.type}</td>
    //                 <td><span class="status-pill ${statusClass}"><i class="fa-solid ${icon}"></i> ${emp.status}</span></td>
    //                 <td>
    //                     <div class="action-menu">
    //                         <button class="btn-action edit-btn" data-id="${emp.id}" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
    //                         <button class="btn-action delete-btn" data-id="${emp.id}" title="Delete" style="color:#FF5B5B;"><i class="fa-regular fa-trash-can"></i></button>
    //                     </div>
    //                 </td>
    //             </tr>
    //         `;
    //         tableBody.innerHTML += row;
    //     });
    // }

    // // --- 5. EVENT DELEGATION (View, Edit, Delete) ---
    if(tableBody) {
        tableBody.addEventListener("click", function(e) {
            
            // VIEW PROFILE
            if (e.target.classList.contains("view-profile-btn") || e.target.closest(".view-profile-btn")) {
                const btn = e.target.closest(".view-profile-btn") || e.target;
                const id = btn.getAttribute("data-id");
                // const selectedEmp = employees.find(emp => emp.id === id);
               
                    localStorage.setItem('employee_id', id);
                    window.location.href = "../emp_details/emp_details.html"; 
                
            }

            // DELETE
            if (e.target.closest(".delete-btn")) {
                const btn = e.target.closest(".delete-btn");
                const id = btn.getAttribute("data-id");
                openDeleteModal(id);
            }
            
            // EDIT
            if (e.target.closest(".edit-btn")) {
                const btn = e.target.closest(".edit-btn");
                const id = btn.getAttribute("data-id");
                openEditModal(id);
            }
        });
    }

    // --- 6. DELETE LOGIC ---
    function openDeleteModal(id) {
        const emp = employees.find(e => e.id === id);
        if(!emp) return;
        deleteTargetId = id;
        if(deleteEmpName) deleteEmpName.innerText = emp.name;
        if(deleteModal) deleteModal.classList.add("active");
    }

    if(confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if(deleteTargetId) {
                employees = employees.filter(emp => emp.id !== deleteTargetId);
                applyFilters(); // Re-render with filters maintained
                deleteModal.classList.remove("active");
            }
        });
    }

    if(cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.classList.remove("active");
            deleteTargetId = null;
        });
    }

    // --- 7. EDIT LOGIC ---
    function openEditModal(id) {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;

        if(document.getElementById("empName")) document.getElementById("empName").value = emp.name;
        if(document.getElementById("empEmail")) document.getElementById("empEmail").value = emp.email;
        if(document.getElementById("empDept")) document.getElementById("empDept").value = emp.dept;
        if(document.getElementById("empRole")) document.getElementById("empRole").value = emp.role;
        if(document.getElementById("empType")) document.getElementById("empType").value = emp.type;
        if(document.getElementById("empStatus")) document.getElementById("empStatus").value = emp.status;

        isEditMode = true;
        currentEditId = id;
        
        if(modalTitle) modalTitle.innerText = "Edit Employee";
        if(submitBtn) submitBtn.innerText = "Update";
        
        modal.classList.add("active");
    }

    // --- 8. ADD NEW ---
    if(addBtn) {
        addBtn.addEventListener("click", () => {
            isEditMode = false;
            currentEditId = null;
            if(employeeForm) employeeForm.reset();
            
            if(modalTitle) modalTitle.innerText = "Add New Employee";
            if(submitBtn) submitBtn.innerText = "Add Employee";
            
            modal.classList.add("active");
        });
    }

    // --- 9. FORM SUBMIT ---
    if(employeeForm) {
        employeeForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("empName").value;
            const email = document.getElementById("empEmail").value;
            const dept = document.getElementById("empDept").value;
            const role = document.getElementById("empRole").value;
            const type = document.getElementById("empType").value;
            const status = document.getElementById("empStatus").value;

            if (isEditMode) {
                const index = employees.findIndex(e => e.id === currentEditId);
                if (index !== -1) {
                    employees[index] = { ...employees[index], name, email, dept, role, type, status };
                    showSuccess("Updated!", "Employee details have been updated successfully.");
                }
            } else {
                const newId = "EMP-" + String(employees.length + 1).padStart(3, '0');
                employees.push({
                    id: newId, name, email, dept, role, type, status,
                    img: "../assets/profiledp.jpeg",
                    joinDate: "01 Nov 2023",
                    salary: "₹0",
                    location: "Not Assigned"
                });
                showSuccess("Added!", "New employee added successfully.");
            }

            applyFilters(); 
            closeModal();
        });
    }

    function closeModal() {
        modal.classList.remove("active");
    }

    if(closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if(cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => { 
        if (e.target === modal) closeModal(); 
        if (e.target === successModal) successModal.classList.remove("active");
        if (e.target === deleteModal) deleteModal.classList.remove("active");
    });

    // --- 10. SEARCH & FILTERS (UPDATED) ---
    function applyFilters() {
        // Get values
        const term = searchInput ? searchInput.value.toLowerCase() : "";
        const deptValue = deptFilter ? deptFilter.value : "all";
        const statusValue = statusFilter ? statusFilter.value : "all";
        const typeValue = empFilter ? empFilter.value : "all"; // NEW: Get Type Value

        const filtered = employees.filter(emp => {
            // 1. Search Check
            const matchesSearch = 
                emp.name.toLowerCase().includes(term) ||
                emp.role.toLowerCase().includes(term) ||
                emp.id.toLowerCase().includes(term);
            
            // 2. Department Check
            const matchesDept = (deptValue === "all") || (emp.dept === deptValue);
            
            // 3. Status Check
            const matchesStatus = (statusValue === "all") || (emp.status === statusValue);

            // 4. Type Check (NEW)
            const matchesType = (typeValue === "all") || (emp.type === typeValue);

            return matchesSearch && matchesDept && matchesStatus && matchesType;
        });

        renderTable(filtered);
    }

    // Attach listeners to all inputs including new empFilter
    if(searchInput) searchInput.addEventListener("input", applyFilters);
    if(deptFilter) deptFilter.addEventListener("change", applyFilters);
    if(statusFilter) statusFilter.addEventListener("change", applyFilters);
    if(empFilter) empFilter.addEventListener("change", applyFilters); // NEW Listener


    // --- 11. DOWNLOAD CSV FUNCTIONALITY ---
    if(downloadBtn) {
        downloadBtn.addEventListener("click", function() {
            exportTableToCSV(employees, "all_employees.csv");
        });
    }

    function exportTableToCSV(dataArray, filename) {
        if (!dataArray || dataArray.length === 0) {
            alert("No data to export!");
            return;
        }

        let csvContent = [];
        const headers = ["ID", "Name", "Email", "Phone", "Department", "Role", "Type", "Status", "Join Date", "Salary", "Location"];
        csvContent.push(headers.join(","));

        dataArray.forEach(item => {
            const row = [
                `"${item.id}"`, `"${item.name}"`, `"${item.email}"`, `"${item.phone || ''}"`,
                `"${item.dept}"`, `"${item.role}"`, `"${item.type}"`, `"${item.status}"`,
                `"${item.joinDate || ''}"`, `"${item.salary || ''}"`, `"${item.location || ''}"`
            ];
            csvContent.push(row.join(","));
        });

        const csvString = csvContent.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- 12. INITIAL RENDER ---
    renderTable(employees);



    
});

// notification section
/* --- NOTIFICATION LOGIC (nt-) --- */

// 1. Dummy Data (Replace with API data later)
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