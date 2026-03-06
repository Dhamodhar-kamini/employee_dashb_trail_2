document.addEventListener("DOMContentLoaded", function () {

    // --- 1. MOCK DATA ---
    let employees = [
        { id: "EMP-001", name: "Dhamodhar Kamini", email: "dhamu@oppty.in", dept: "Engineering", role: "Frontend Dev", type: "Full Time", status: "Active", img: "../assets/profiledp.jpeg" },
        { id: "EMP-002", name: "Saleem", email: "saleem@oppty.in", dept: "Design", role: "UI/UX Designer", type: "Full Time", status: "On Leave", img: "../assets/profiledp.jpeg" },
        { id: "EMP-003", name: "Siddarth", email: "Siddu@oppty.in", dept: "Marketing", role: "SEO Specialist", type: "Contract", status: "Active", img: "../assets/profiledp.jpeg" },
        { id: "EMP-004", name: "Manikanta", email: "mani@oppty.in", dept: "Engineering", role: "Backend Dev", type: "Full Time", status: "Remote", img: "../assets/profiledp.jpeg" },
        { id: "EMP-005", name: "Arjun Kamini", email: "arjun@oppty.in", dept: "HR", role: "HR Manager", type: "Full Time", status: "Active", img: "../assets/profiledp.jpeg" },
        { id: "EMP-006", name: "Nani", email: "nani@oppty.in", dept: "Engineering", role: "QA Tester", type: "Internship", status: "Active", img: "../assets/profiledp.jpeg" }
    ];

    // --- 2. DOM ELEMENTS ---
    const tableBody = document.getElementById("employeeTableBody");
    
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

    // State Variables
    let isEditMode = false;
    let currentEditId = null;

    // --- 3. HELPER: SHOW SUCCESS POPUP ---
    function showSuccess(title, msg) {
        if(successTitle) successTitle.innerText = title;
        if(successMessage) successMessage.innerText = msg;
        if(successModal) successModal.classList.add("active");
    }

    // Close Success Modal
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
                                <span class="user-name">${emp.name}</span>
                                <span class="user-email">${emp.email}</span>
                            </div>
                        </div>
                    </td>
                    <td style="color:var(--text-grey); font-family:monospace;">${emp.id}</td>
                    <td>${emp.dept}</td>
                    <td>${emp.role}</td>
                    <td><span style="font-weight:400; color:var(--text-grey);">${emp.type}</span></td>
                    <td>
                        <span class="status-pill ${statusClass}">
                            <i class="fa-solid ${icon}"></i> ${emp.status}
                        </span>
                    </td>
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

    // --- 5. EVENT DELEGATION (Table Actions) ---
    if(tableBody) {
        tableBody.addEventListener("click", function(e) {
            // DELETE Action
            if (e.target.closest(".delete-btn")) {
                const btn = e.target.closest(".delete-btn");
                const id = btn.getAttribute("data-id");
                deleteEmployee(id);
            }
            // EDIT Action
            if (e.target.closest(".edit-btn")) {
                const btn = e.target.closest(".edit-btn");
                const id = btn.getAttribute("data-id");
                openEditModal(id);
            }
        });
    }

    // --- 6. DELETE LOGIC ---
    function deleteEmployee(id) {
        if (confirm(`Are you sure you want to delete employee ${id}?`)) {
            // Filter out specific ID (Fixes "deleting all" bug)
            employees = employees.filter(emp => emp.id !== id);
            renderTable(employees); 
        }
    }

    // --- 7. EDIT/ADD LOGIC ---
    function openEditModal(id) {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;

        // Populate Form Fields
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

    // Add New Button Click
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

    // --- 8. FORM SUBMIT HANDLER ---
    if(employeeForm) {
        employeeForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Capture Values
            const name = document.getElementById("empName").value;
            const email = document.getElementById("empEmail").value;
            const dept = document.getElementById("empDept").value;
            const role = document.getElementById("empRole").value;
            const type = document.getElementById("empType").value;
            const status = document.getElementById("empStatus").value;

            if (isEditMode) {
                // Update Existing
                const index = employees.findIndex(e => e.id === currentEditId);
                if (index !== -1) {
                    employees[index] = { ...employees[index], name, email, dept, role, type, status };
                    showSuccess("Updated!", "Employee details have been updated successfully.");
                }
            } else {
                // Add New
                const newId = "EMP-" + String(employees.length + 1).padStart(3, '0');
                employees.push({
                    id: newId, 
                    name, 
                    email, 
                    dept, 
                    role, 
                    type, 
                    status,
                    img: "../assets/profiledp.jpeg"
                });
                showSuccess("Added!", "New employee added successfully.");
            }

            renderTable(employees);
            closeModal();
        });
    }

    // --- 9. MODAL CLOSE UTILS ---
    function closeModal() {
        modal.classList.remove("active");
    }

    if(closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if(cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => { 
        if (e.target === modal) closeModal(); 
        if (e.target === successModal) successModal.classList.remove("active");
    });

    // --- 10. INITIAL RENDER ---
    renderTable(employees);
});