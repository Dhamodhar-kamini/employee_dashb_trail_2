document.addEventListener("DOMContentLoaded", () => {
  console.log("oppty Dashboard JS Initialized.");

  // --- 1. Job Applicants Tab Switching ---
  const applicantTabsContainer = document.querySelector(
    "#job-applicants .tabs",
  );
  const applicantListContainer = document.getElementById(
    "applicant-list-content",
  );

  const OPENINGS_CONTENT = `
        <div class="user-entry">
            <img src="../assets/profiledp.jpeg">
            <div><strong>Lead Backend Engineer</strong><small>Exp: 5+ Years • USA</small></div>
            <span class="badge python" style="background-color: var(--color-purple);">Python</span>
        </div>
        <div class="user-entry">
            <img src="../assets/profiledp.jpeg">
            <div><strong>HR Manager</strong><small>Exp: 3+ Years • UK</small></div>
            <span class="badge finance" style="background-color: var(--color-red);">HR</span>
        </div>
    `;

  const APPLICANTS_CONTENT = `
        <div class="user-entry">
            <img src="../assets/profiledp.jpeg">
            <div><strong>Brian Villalobos</strong><small>Exp: 5+ Years • USA</small></div>
            <span class="badge ui-ux" style="background-color: var(--color-teal);">UI/UX Designer</span>
        </div>
        <div class="user-entry">
            <img src="../assets/profiledp.jpeg">
            <div><strong>Anthony Lewis</strong><small>Exp: 4+ Years • USA</small></div>
            <span class="badge python" style="background-color: var(--color-blue);">Python Developer</span>
        </div>
        <div class="user-entry">
            <img src="../assets/profiledp.jpeg">
            <div><strong>Stephan Peralt</strong><small>Exp: 6+ Years • USA</small></div>
            <span class="badge android" style="background-color: var(--color-orange);">Android Developer</span>
        </div>
        <div class="user-entry">
            <img src="../assets/profiledp.jpeg">
            <div><strong>Doglas Martini</strong><small>Exp: 2+ Years • USA</small></div>
            <span class="badge react" style="background-color: var(--color-green);">React Developer</span>
        </div>
    `;

  // Initialize the default view based on the image (Applicants selected)
  applicantListContainer.innerHTML = APPLICANTS_CONTENT;

  applicantTabsContainer.addEventListener("click", (e) => {
    const tabButton = e.target.closest(".tab-btn");
    if (!tabButton) return;

    // Remove active state from all
    document.querySelectorAll("#job-applicants .tab-btn").forEach((btn) => {
      btn.classList.remove("active");
      btn.style.cssText = ""; // Reset inline styles applied for active state
    });

    // Add active state to clicked tab
    tabButton.classList.add("active");
    tabButton.style.cssText =
      "background: var(--card-bg); box-shadow: 0 1px 3px rgba(0,0,0,0.1); color: var(--color-blue);";

    const tabType = tabButton.getAttribute("data-tab");

    if (tabType === "openings") {
      applicantListContainer.innerHTML = OPENINGS_CONTENT;
    } else {
      applicantListContainer.innerHTML = APPLICANTS_CONTENT;
    }
  });

  // --- 2. Sidebar Menu Submenu Toggle (Simulated) ---
  const superAdminItem = document.querySelector(
    ".applications-section .active-parent",
  );
  const submenu = superAdminItem.nextElementSibling;

  superAdminItem.addEventListener("click", (e) => {
    e.preventDefault();
    submenu.classList.toggle("hidden");
    const icon = superAdminItem.querySelector(
      ".fa-chevron-down, .fa-chevron-right",
    );
    if (icon) {
      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-right");
    }
  });
});

// Attendance Doughnut Chart

document.addEventListener("DOMContentLoaded", function () {
  // Attendance Data
  const data = {
    present: 90,
    late: 30,
    absent: 5,
    wfh: 25,
  };

  const total = data.present + data.late + data.absent + data.wfh;
  document.getElementById("totalCount").textContent = total;

  // Set percentage text
  document.getElementById("pPresent").textContent =
    Math.round((data.present / total) * 100) + "%";
  document.getElementById("pLate").textContent =
    Math.round((data.late / total) * 100) + "%";
  document.getElementById("pAbsent").textContent =
    Math.round((data.absent / total) * 100) + "%";
  document.getElementById("pWFH").textContent =
    Math.round((data.wfh / total) * 100) + "%";

  // Arc settings
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  let startAngle = Math.PI; // 180 degrees (left side)

  function describeArc(startAngle, endAngle) {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      0,
      0,
      end.x,
      end.y,
    ].join(" ");
  }

  function polarToCartesian(cx, cy, r, angle) {
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  function drawArc(value, elementId) {
    const angle = (value / total) * Math.PI;
    const endAngle = startAngle + angle;

    const path = describeArc(startAngle, endAngle);
    document.getElementById(elementId).setAttribute("d", path);

    startAngle = endAngle;
  }

  // Draw arcs in order
  drawArc(data.present, "arc-present");
  drawArc(data.late, "arc-late");
  drawArc(data.absent, "arc-absent");
  drawArc(data.wfh, "arc-wfh");
});

document.getElementById("dashboardMenu").addEventListener("click", function () {
  const submenu = document.getElementById("dashboardSubmenu");

  submenu.classList.toggle("open");
  this.classList.toggle("open");
});


//attendance details modal
document.addEventListener("DOMContentLoaded", () => {
  const detailModal = document.getElementById("detailModal");
  const modalTableBody = document.getElementById("modalTableBody");
  const closeBtn = document.querySelector(".close-btn");

  // UPDATED DATA: Removed 'status'
  const ATTENDANCE_LOG_DATA = [
    {
      id: 21918,
      name: "Dhamodhar Kamini",
      role: "Graphic Designer",
      date: "26-02-2026",
      checkIn: "09:00 AM",
      checkOut: "07:00 PM",
      duration: "8h 0m",
    },
    {
      id: 37189,
      name: "Denny Malik",
      role: "IT Support",
      date: "22-08-2024",
      checkIn: "08:00 AM",
      checkOut: "05:00 PM",
      duration: "9h 0m",
    },
    {
      id: 41521,
      name: "Silvia Cintia Bakri",
      role: "Product Designer",
      date: "15-07-2024",
      checkIn: "09:30 AM",
      checkOut: "06:00 PM",
      duration: "8h 30m",
    },
    {
      id: 12781,
      name: "Bambang Pramudi",
      role: "Customer Support",
      date: "10-08-2024",
      checkIn: "08:00 AM",
      checkOut: "05:30 PM",
      duration: "9h 30m",
    },
  ];

  function renderAttendanceModal(data) {
    let html = "";

    if (!data || data.length === 0) {
      // Adjusted colspan since the status column is gone
      modalTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No data available</td></tr>';
      detailModal.style.display = "block";
      return;
    }

    data.forEach((item) => {
      // Fixed color since status is removed (Standard Blue)
      const colorCode = "42A5F5"; 

      html += `
                <tr>
                    <td>#${item.id}</td>
                    <td class="employee-cell">
                        <div style="display: flex; align-items: center;">
                            <img 
                                src="https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=${colorCode}&color=fff" 
                                alt="${item.name}"
                                style="width: 35px; height: 35px; border-radius: 50%; margin-right: 10px;"
                            >
                            <div class="employee-info">
                                <strong style="display: block; font-size: 14px;">${item.name}</strong>
                                <small style="color: #666; font-size: 12px;">${item.role}</small>
                            </div>
                        </div>
                    </td>
                    <td>${item.date}</td>
                    <td>
                        <div style="font-size: 13px;">In: ${item.checkIn}</div>
                        <div style="font-size: 13px;">Out: ${item.checkOut}</div>
                    </td>
                    <td>${item.duration}</td>
                </tr>
            `;
    });
    modalTableBody.innerHTML = html;
    detailModal.style.display = "block";
  }

  function closeModal() {
    detailModal.style.display = "none";
  }

  // Trigger Logic
  const attendanceLink = document.querySelector(".attendance-trigger");

  if (attendanceLink) {
    attendanceLink.addEventListener("click", (e) => {
      e.preventDefault();
      renderAttendanceModal(ATTENDANCE_LOG_DATA);
    });
  } else {
    console.warn("Element with class '.attendance-trigger' not found.");
  }

  // Close Button Logic
  if (closeBtn) closeBtn.onclick = closeModal;

  // Click outside to close
  window.onclick = (event) => {
    if (event.target === detailModal) {
      closeModal();
    }
  };
});

//employee details status modal
// document.addEventListener('DOMContentLoaded', () => {
//     // DOM Elements
//     const employeeModal = document.getElementById('employeeModal');
//     const tableBody = document.getElementById('employeeTableBody');
//     const searchInput = document.getElementById('employeeSearch');
//     const closeBtn = document.querySelector('.close-employee-btn');
//     const triggerBtn = document.querySelector('.employee-trigger');

//     // Data matching the reference image
//     const EMPLOYEES = [
//         { id: 1, name: "Emily", email: "emily.thompson23@gmail.com", position: "Web Developer", emp_id:"EMP001", salary: "₹70,000" },
//         { id: 2, name: "Michael", email: "m.johnson87@gmail.com", position: "Mobile Developer", emp_id:"EMP002", salary: "₹65,000" },
//         { id: 3, name: "Jessica", email: "jessica.carter89@yahoo.com", position: "QA", status: "Active", emp_id:"EMP003", salary: "₹55,000" },
//         { id: 4, name: "Olivia", email: "olivia.brooks91@outlook.com", position: "UX/UI designer", emp_id:"EMP004", salary: "₹68,000" },
//         { id: 5, name: "Ethan", email: "ethan.miller22@protonmail.com", position: "Graphic designer", emp_id:"EMP005", salary: "₹52,000" },
//         { id: 6, name: "Jacob",  email: "jacob.anderson77@hotmail.com", position: "Sales manager", emp_id:"EMP006", salary: "₹72,000" },
//         { id: 7, name: "Sophia", email: "sophia.m@gmail.com", position: "Content Writer", emp_id:"EMP007", salary: "₹50,000" },
//         { id: 8, name: "Daniel", email: "dan.wilson@tech.com", position: "Project Manager", emp_id:"EMP008", salary: "$75,000" },
//     ];

//     // Function to Render Table
//     function renderTable(data) {
//         let html = '';
//         if(data.length === 0) {
//             html = '<tr><td colspan="6" style="text-align:center;">No employees found</td></tr>';
//         } else {
//             data.forEach(emp => {
//                 const badgeClass = emp.status === 'Active' ? 'badge-active' : 'badge-inactive';

//                 html += `
//                     <tr>
//                         <td>${emp.emp_id}</td>
//                         <td>${emp.name}</td>

//                         <td>${emp.email}</td>
//                         <td>${emp.position}</td>
//                         <td>${emp.salary}</td>

//                     </tr>
//                 `;
//             });
//         }
//         tableBody.innerHTML = html;
//     }

//     // Event: Open Modal
//     if (triggerBtn) {
//         triggerBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             renderTable(EMPLOYEES); // Render all data initially
//             employeeModal.style.display = "block";
//         });
//     }

// // Event: Search Functionality
// if (searchInput) {
//     searchInput.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();

//         const filtered = EMPLOYEES.filter(emp =>
//             // This checks if the user's typed text exists inside the employee's name
//             emp.name.toLowerCase().includes(term)
//         );

//         renderTable(filtered);
//     });
// }

//     // Event: Close Modal
//     if(closeBtn) {
//         closeBtn.onclick = () => {
//             employeeModal.style.display = "none";
//             searchInput.value = ''; // Reset search on close
//         };
//     }

//     // Close on clicking outside
//     window.onclick = (event) => {
//         if (event.target === employeeModal) {
//             employeeModal.style.display = "none";
//             if(searchInput) searchInput.value = '';
//         }
//     };
// });

//testing employee details status modal
document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 1. SHARED DATA 
  // (I standardized IDs to "001" format to match your request)
  // =========================================================
  const EMPLOYEES = [
    // { id: 1, name: "Emily", email: "emily.thompson23@gmail.com", position: "Web Developer", emp_id: "001", salary: "$70,000" },
    // { id: 2, name: "Michael", email: "m.johnson87@gmail.com", position: "Mobile Developer", emp_id: "002", salary: "$65,000" },
    // { id: 3, name: "Jessica", email: "jessica.carter89@yahoo.com", position: "QA", status: "Active", emp_id: "003", salary: "$55,000" },
    // { id: 4, name: "Olivia", email: "olivia.brooks91@outlook.com", position: "UX/UI designer", emp_id: "004", salary: "$68,000" },
    // { id: 5, name: "Ethan", email: "ethan.miller22@protonmail.com", position: "Graphic designer", emp_id: "005", salary: "$52,000" },
    // { id: 6, name: "Jacob", email: "jacob.anderson77@hotmail.com", position: "Sales manager", emp_id: "006", salary: "$72,000" },
    // { id: 7, name: "Sophia", email: "sophia.m@gmail.com", position: "Content Writer", emp_id: "007", salary: "$50,000" },
    // { id: 8, name: "Daniel", email: "dan.wilson@tech.com", position: "Project Manager", emp_id: "008", salary: "$75,000" },
  ];

  // =========================================================
  // 2. DOM ELEMENTS
  // =========================================================
  // Table Elements
  const employeeModal = document.getElementById("employeeModal");
  const tableBody = document.getElementById("employeeTableBody");
  const searchInput = document.getElementById("employeeSearch");
  const closeEmployeeBtn = document.querySelector(".close-employee-btn");
  const triggerEmployeeBtn = document.querySelector(".employee-trigger"); 
  const addEmpFromTableBtn = document.getElementById("addEmpFromTableBtn"); // Button inside table

  // Form Elements
  const empModal = document.getElementById("empModal");
  const empOpenBtn = document.getElementById("empOpenBtn"); // Dashboard button
  const empCloseBtn = document.getElementById("empCloseBtn");
  const empCancelBtn = document.getElementById("empCancelBtn");
  const empForm = document.getElementById("empForm");
  
  // Success Elements
  const successModal = document.getElementById("successModal");
  const successOkBtn = document.getElementById("successOkBtn");

  // =========================================================
  // 3. TABLE FUNCTIONS
  // =========================================================
  function renderTable(data) {
    let html = "";
    if (data.length === 0) {
      html = '<tr><td colspan="5" style="text-align:center;">No employees found</td></tr>';
    } else {
      data.forEach((emp) => {
        html += `
            <tr>
                <td>${emp.emp_id}</td>
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.position}</td>
                <td>${emp.salary}</td>
            </tr>
        `;
      });
    }
    if (tableBody) tableBody.innerHTML = html;
  }

  // Open Table Logic
  if (triggerEmployeeBtn) {
    triggerEmployeeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      renderTable(EMPLOYEES); 
      employeeModal.style.display = "block";
    });
  }

  // Search Logic
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = EMPLOYEES.filter((emp) =>
        emp.name.toLowerCase().includes(term) ||
        emp.emp_id.toLowerCase().includes(term)
      );
      renderTable(filtered);
    });
  }

  // Close Table Logic
  const closeTableModal = () => {
      employeeModal.style.display = "none";
      if(searchInput) searchInput.value = "";
  }
  if (closeEmployeeBtn) closeEmployeeBtn.onclick = closeTableModal;


  // =========================================================
  // 4. FORM OPEN/CLOSE LOGIC
  // =========================================================
  
  // A. Open from Main Dashboard
  if (empOpenBtn) empOpenBtn.onclick = () => (empModal.style.display = "flex");

  // B. Open from Inside Table (The fix you asked for)
  if (addEmpFromTableBtn) {
      addEmpFromTableBtn.onclick = () => {
          // We do NOT close employeeModal here. We just open the form on top.
          empModal.style.display = "flex";      
      }
  }

  // Close Form Logic
  const closeAddModal = () => {
    empModal.style.display = "none";
  };

  if (empCloseBtn) empCloseBtn.onclick = () => { closeAddModal(); resetForm(); };
  if (empCancelBtn) empCancelBtn.onclick = () => { closeAddModal(); resetForm(); };


  // =========================================================
  // 5. VALIDATION
  // =========================================================
  const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error-msg");
    if (errorDisplay) {
      errorDisplay.innerText = message;
      errorDisplay.style.display = "block";
    }
    element.classList.add("input-error");
  };

  const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error-msg");
    if (errorDisplay) {
      errorDisplay.innerText = "";
      errorDisplay.style.display = "none";
    }
    element.classList.remove("input-error");
  };

  const isValidEmail = (email) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
  };

  const validateInputs = () => {
    let isValid = true;
    const name = document.getElementById("nameInput");
    const empId = document.getElementById("empIdInput");
    const email = document.getElementById("emailInput");
    const password = document.getElementById("passwordInput");
    const hireDate = document.getElementById("dateInput");
    const salary = document.getElementById("salaryInput");

    if (name.value.trim() === "") { setError(name, "Name is required"); isValid = false; } else { setSuccess(name); }
    if (empId.value.trim() === "") { setError(empId, "Employee ID is required"); isValid = false; } else if (isNaN(empId.value.trim()) || empId.value.trim().length < 3) { setError(empId, "Employee ID must be numeric and at least 3 characters long"); isValid = false; } else { setSuccess(empId); }
    if (email.value.trim() === "") { setError(email, "Email is required"); isValid = false; } else if (!isValidEmail(email.value.trim())) { setError(email, "Invalid email"); isValid = false; } else { setSuccess(email); }
    if (password.value.trim() === "") { setError(password, "Password required"); isValid = false; } else if (password.value.trim().length < 6) { setError(password, "Min 6 chars"); isValid = false; } else { setSuccess(password); }
    if (hireDate.value === "") { setError(hireDate, "Date required"); isValid = false; } else { setSuccess(hireDate); }
    if (salary.value !== "" && salary.value < 0) { setError(salary, "Invalid salary"); isValid = false; } else { setSuccess(salary); }

    return isValid;
  };

  // =========================================================
  // 6. SUBMIT & UPDATE LOGIC
  // =========================================================
  empForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateInputs()) {
      // 1. Get Values
      const nameVal = document.getElementById("nameInput").value;
      const empIdVal = document.getElementById("empIdInput").value;
      const emailVal = document.getElementById("emailInput").value;
      const jobVal = document.getElementById("jobInput").value;
      const salaryVal = document.getElementById("salaryInput").value;

      // 2. ID GENERATION (Fixed)
      const empIdNum = parseInt(empIdVal);
      // Look at the last ID in the array (e.g., "008") and add 1
      
    //   const lastEmp = EMPLOYEES[EMPLOYEES.length - 1];
    //   const lastIdNum = lastEmp ? parseInt(lastEmp.empIdVal) : 0;
    
    //   const newIdNum = lastIdNum + 1;
      // Pad with zeros: 9 -> "009"
      const newEmpId = String(empIdNum).padStart(3, "0");

      // 3. Format Salary
      const formattedSalary = salaryVal ? "₹" + parseInt(salaryVal).toLocaleString() : "₹0";

      // 4. Create Object
      const newEmployee = {
        id: empIdNum,
        name: nameVal,
        email: emailVal,
        position: jobVal || "Not Specified",
        emp_id: newEmpId, // Uses the generated ID
        salary: formattedSalary,
      };

      // 5. Update Array
      EMPLOYEES.push(newEmployee);
      console.log("New Employee Added:", newEmployee);

      // 6. Refresh Table (Background table updates instantly)
      renderTable(EMPLOYEES);

      // 7. Handle Modals
      closeAddModal(); // Close the form
      if (successModal) successModal.style.display = "flex"; // Show success
      // Note: We do NOT close employeeModal (table) here
    }
  });

  // Success Button Action
  if (successOkBtn) {
    successOkBtn.onclick = () => {
      successModal.style.display = "none";
      resetForm();
    };
  }

  // =========================================================
  // 7. GLOBAL CLICK HANDLER (Smart Closing)
  // =========================================================
  window.onclick = function (e) {
    // If clicking outside Add Form
    if (e.target === empModal) {
      closeAddModal();
      resetForm();
    }
    // If clicking outside Table (Only if Add Form is NOT open)
    // This prevents closing the table when you are actually clicking the Add Form overlay
    if (e.target === employeeModal && empModal.style.display !== "flex") {
      closeTableModal();
    }
    // If clicking outside Success
    if (e.target === successModal) {
      successModal.style.display = "none";
      resetForm();
    }
  };

  function resetForm() {
    empForm.reset();
    const inputs = empForm.querySelectorAll("input, select");
    inputs.forEach((input) => setSuccess(input));
  }
});