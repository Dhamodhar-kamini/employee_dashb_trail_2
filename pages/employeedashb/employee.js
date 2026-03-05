document.addEventListener("DOMContentLoaded", function () {

    // --- 1. MOCK DATA ---
    const employees = [
        { id: "EMP-001", name: "Maisha Lucy", email: "maisha@oppty.in", dept: "Engineering", role: "Frontend Dev", type: "Full Time", status: "Active", img: "../assets/profiledp.jpeg" },
        { id: "EMP-002", name: "Thomas Goodman", email: "thomas@oppty.in", dept: "Design", role: "UI/UX Designer", type: "Full Time", status: "On Leave", img: "../assets/profiledp.jpeg" },
        { id: "EMP-003", name: "Uma Stafford", email: "uma@oppty.in", dept: "Marketing", role: "SEO Specialist", type: "Contract", status: "Active", img: "../assets/profiledp.jpeg" },
        { id: "EMP-004", name: "Khubaib Ahmed", email: "khubaib@oppty.in", dept: "Engineering", role: "Backend Dev", type: "Full Time", status: "Remote", img: "../assets/profiledp.jpeg" },
        { id: "EMP-005", name: "Zamora Peck", email: "zamora@oppty.in", dept: "HR", role: "HR Manager", type: "Full Time", status: "Active", img: "../assets/profiledp.jpeg" },
        { id: "EMP-006", name: "Alex Morgan", email: "alex@oppty.in", dept: "Engineering", role: "QA Tester", type: "Internship", status: "Active", img: "../assets/profiledp.jpeg" }
    ];

    const tableBody = document.getElementById("employeeTableBody");
    const searchInput = document.getElementById("searchInput");
    const deptFilter = document.getElementById("deptFilter");
    const statusFilter = document.getElementById("statusFilter");

    // --- 2. RENDER TABLE ---
    function renderTable(data) {
        if(!tableBody) return;
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
                            <button class="btn-action" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button class="btn-action" title="Delete" style="color:#FF5B5B;"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Initial Render
    renderTable(employees);

    // --- 3. FILTER & SEARCH LOGIC ---
    function filterEmployees() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedDept = deptFilter.value;
        const selectedStatus = statusFilter.value;

        const filtered = employees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(searchTerm) || 
                                  emp.role.toLowerCase().includes(searchTerm) || 
                                  emp.id.toLowerCase().includes(searchTerm);
            
            const matchesDept = selectedDept === "all" || emp.dept === selectedDept;
            const matchesStatus = selectedStatus === "all" || emp.status === selectedStatus;

            return matchesSearch && matchesDept && matchesStatus;
        });

        renderTable(filtered);
    }

    // Event Listeners
    if(searchInput) searchInput.addEventListener("input", filterEmployees);
    if(deptFilter) deptFilter.addEventListener("change", filterEmployees);
    if(statusFilter) statusFilter.addEventListener("change", filterEmployees);

    // --- 4. MODAL LOGIC ---
    const modal = document.getElementById("employeeModal");
    const openBtn = document.getElementById("addEmployeeBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelModalBtn");

    if (openBtn) {
        openBtn.addEventListener("click", () => {
            modal.classList.add("active");
        });
    }

    const closeModal = () => modal.classList.remove("active");

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

});