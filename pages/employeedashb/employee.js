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
    const searchInput = document.getElementById("searchInput");
    
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

    // DELETE MODAL ELEMENTS (NEW)
    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const deleteEmpName = document.getElementById("deleteEmpName");

    // State Variables
    let isEditMode = false;
    let currentEditId = null;
    let deleteTargetId = null; // Store ID to delete

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

    // --- 4. RENDER TABLE ---
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color:#999;">No employees found.</td></tr>`;
            return;
        }

        data.forEach(emp => {
            let statusClass = "status-active";
            let icon = "fa-check";

            if (emp.status === "On Leave") { statusClass = "status-leave"; icon = "fa-clock"; }
            else if (emp.status === "Remote") { statusClass = "status-remote"; icon = "fa-house-laptop"; }

            const row = `
                <tr>
                    <td>
                        <div class="user-cell">
                            <img src="${emp.img}" alt="u">
                            <div class="user-info">
                                <span class="user-name view-profile-btn" data-id="${emp.id}" 
                                      style="cursor:pointer; color:#FF5B1E; font-weight:600;">
                                    ${emp.name}
                                </span>
                                <span class="user-email">${emp.email}</span>
                            </div>
                        </div>
                    </td>
                    <td>${emp.id}</td>
                    <td>${emp.dept}</td>
                    <td>${emp.role}</td>
                    <td>${emp.type}</td>
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
        });
    }

    // --- 5. EVENT DELEGATION ---
    if(tableBody) {
        tableBody.addEventListener("click", function(e) {
            
            // VIEW PROFILE
            if (e.target.classList.contains("view-profile-btn")) {
                const id = e.target.getAttribute("data-id");
                const selectedEmp = employees.find(emp => emp.id === id);
                if (selectedEmp) {
                    localStorage.setItem("viewEmployeeData", JSON.stringify(selectedEmp));
                    window.location.href = "../emp_details/emp_details.html"; 
                }
            }

            // DELETE BUTTON CLICKED (Open Custom Modal)
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

    // --- 6. DELETE LOGIC (UPDATED WITH MODAL) ---
    function openDeleteModal(id) {
        const emp = employees.find(e => e.id === id);
        if(!emp) return;

        deleteTargetId = id; // Store ID for confirmation
        if(deleteEmpName) deleteEmpName.innerText = emp.name;
        if(deleteModal) deleteModal.classList.add("active");
    }

    // Confirm Delete Click
    if(confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if(deleteTargetId) {
                employees = employees.filter(emp => emp.id !== deleteTargetId);
                renderTable(employees);
                deleteModal.classList.remove("active");
                // Optional: Show success message for delete too
                // showSuccess("Deleted!", "Employee has been removed.");
            }
        });
    }

    // Cancel Delete Click
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

            renderTable(employees);
            closeModal();
        });
    }

    // Modal Close Utils
    function closeModal() {
        modal.classList.remove("active");
    }

    if(closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if(cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);
    
    // Global Click Listener for Modals
    window.addEventListener("click", (e) => { 
        if (e.target === modal) closeModal(); 
        if (e.target === successModal) successModal.classList.remove("active");
        if (e.target === deleteModal) deleteModal.classList.remove("active");
    });

    // --- 10. SEARCH FILTER ---
    if(searchInput) {
        searchInput.addEventListener("input", function(e) {
            const term = e.target.value.toLowerCase();
            const filtered = employees.filter(emp => 
                emp.name.toLowerCase().includes(term) ||
                emp.role.toLowerCase().includes(term) ||
                emp.id.toLowerCase().includes(term)
            );
            renderTable(filtered);
        });
    }

    // --- 11. INITIAL RENDER ---
    renderTable(employees);
});