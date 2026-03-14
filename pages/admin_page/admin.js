
// employee_details_table = document.getElementById('employeeTBody')
// function loademployees()
// {
    
//   fetch("http://13.60.70.185:8000/api/employees/")
//   .then(res => res.json())
//         .then(data => 
//           {
//             console.log("Data fetched:", data);
//             employee_details_table.innerHTML = "";
//             data.forEach(p => 
//               {
//                 const row = document.createElement("tr");
//                 row.innerHTML = `
//                     <td>${p.employee_id}</td>
//                     <td>${p.name}</td>
//                     <td>₹${p.email}</td>
//                     <td>₹${p.role}</td>
//                     <td>₹${p.salary}</td>
//                 `;
//                 employee_details_table.appendChild(row);
                
//             }).catch(err => {
//             console.error("Error fetching payslips:", err);
//             employee_details.innerHTML = `<tr><td colspan="4">Error loading payslips</td></tr>`;
//         });
//           });
        
// }

// document.addEventListener("DOMContentLoaded",loademployees)

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
//   applicantListContainer.innerHTML = APPLICANTS_CONTENT;

//   applicantTabsContainer.addEventListener("click", (e) => {
//     const tabButton = e.target.closest(".tab-btn");
//     if (!tabButton) return;

//     // Remove active state from all
//     document.querySelectorAll("#job-applicants .tab-btn").forEach((btn) => {
//       btn.classList.remove("active");
//       btn.style.cssText = ""; // Reset inline styles applied for active state
//     });

//     // Add active state to clicked tab
//     tabButton.classList.add("active");
//     tabButton.style.cssText =
//       "background: var(--card-bg); box-shadow: 0 1px 3px rgba(0,0,0,0.1); color: var(--color-blue);";

//     const tabType = tabButton.getAttribute("data-tab");

//     if (tabType === "openings") {
//       applicantListContainer.innerHTML = OPENINGS_CONTENT;
//     } else {
//       applicantListContainer.innerHTML = APPLICANTS_CONTENT;
//     }
//   });

  // --- 2. Sidebar Menu Submenu Toggle (Simulated) ---
//   const superAdminItem = document.querySelector(
//     ".applications-section .active-parent",
//   );
//   const submenu = superAdminItem.nextElementSibling;

//   superAdminItem.addEventListener("click", (e) => {
//     e.preventDefault();
//     submenu.classList.toggle("hidden");
//     const icon = superAdminItem.querySelector(
//       ".fa-chevron-down, .fa-chevron-right",
//     );
//     if (icon) {
//       icon.classList.toggle("fa-chevron-down");
//       icon.classList.toggle("fa-chevron-right");
//     }
//   });
});

// Attendance Doughnut Chart

// document.addEventListener("DOMContentLoaded", function () {
//   // Attendance Data
//   const data = {
//     present: 90,
//     late: 30,
//     absent: 5,
//     wfh: 25,
//   };

//   const total = data.present + data.late + data.absent + data.wfh;
//   document.getElementById("totalCount").textContent = total;

//   // Set percentage text
//   document.getElementById("pPresent").textContent =
//     Math.round((data.present / total) * 100) + "%";
//   document.getElementById("pLate").textContent =
//     Math.round((data.late / total) * 100) + "%";
//   document.getElementById("pAbsent").textContent =
//     Math.round((data.absent / total) * 100) + "%";
//   document.getElementById("pWFH").textContent =
//     Math.round((data.wfh / total) * 100) + "%";

//   // Arc settings
//   const radius = 80;
//   const centerX = 100;
//   const centerY = 100;

//   let startAngle = Math.PI; // 180 degrees (left side)

//   function describeArc(startAngle, endAngle) {
//     const start = polarToCartesian(centerX, centerY, radius, endAngle);
//     const end = polarToCartesian(centerX, centerY, radius, startAngle);

//     return [
//       "M",
//       start.x,
//       start.y,
//       "A",
//       radius,
//       radius,
//       0,
//       0,
//       0,
//       end.x,
//       end.y,
//     ].join(" ");
//   }

//   function polarToCartesian(cx, cy, r, angle) {
//     return {
//       x: cx + r * Math.cos(angle),
//       y: cy + r * Math.sin(angle),
//     };
//   }

//   function drawArc(value, elementId) {
//     const angle = (value / total) * Math.PI;
//     const endAngle = startAngle + angle;

//     const path = describeArc(startAngle, endAngle);
//     document.getElementById(elementId).setAttribute("d", path);

//     startAngle = endAngle;
//   }

//   // Draw arcs in order
//   drawArc(data.present, "arc-present");
//   drawArc(data.late, "arc-late");
//   drawArc(data.absent, "arc-absent");
//   drawArc(data.wfh, "arc-wfh");
// });

// document.getElementById("dashboardMenu").addEventListener("click", function () {
//   const submenu = document.getElementById("dashboardSubmenu");

//   submenu.classList.toggle("open");
//   this.classList.toggle("open");
// });


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
      name: "Saleem",
      role: "IT Support",
      date: "22-08-2024",
      checkIn: "08:00 AM",
      checkOut: "05:00 PM",
      duration: "9h 0m",
    },
    {
      id: 41521,
      name: "Manikanta",
      role: "Product Designer",
      date: "15-07-2024",
      checkIn: "09:30 AM",
      checkOut: "06:00 PM",
      duration: "8h 30m",
    },
    {
      id: 12781,
      name: "Siddartha",
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


document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Employees Array
    // We start empty, or you can pre-fill it.
    // The structure needs a 'type' property that matches: "WFO", "WFH", or "Internship".
    const EMPLOYEES = [];

    // --- Selectors ---
    const employeeModal = document.getElementById("employeeModal");
    const tableBody = document.getElementById("employeeTableBody");
    const searchInput = document.getElementById("employeeSearch");
    const closeEmployeeBtn = document.querySelector(".close-employee-btn");
    const triggerEmployeeBtn = document.querySelector(".employee-trigger");
    const addEmpFromTableBtn = document.getElementById("addEmpFromTableBtn");

    const empModal = document.getElementById("empModal");
    const empOpenBtn = document.getElementById("empOpenBtn");
    const empCloseBtn = document.getElementById("empCloseBtn");
    const empCancelBtn = document.getElementById("empCancelBtn");
    const empForm = document.getElementById("empForm");

    const successModal = document.getElementById("successModal");
    const successOkBtn = document.getElementById("successOkBtn");

    // =========================================================
    // 2. DASHBOARD STATS LOGIC (Fixed)
    // =========================================================
    function updateDashboardStats() {
        const total = EMPLOYEES.length;

        // Initialize counters keys must match select option values exactly
        let counts = {
            "WFO": 0,
            "WFH": 0,
            "Internship": 0
        };

        // Count employees
        EMPLOYEES.forEach(emp => {
            // Ensure emp.type matches one of the keys
            if (counts.hasOwnProperty(emp.type)) {
                counts[emp.type]++;
            }
        });

        // 1. Update Total Count
        const totalEl = document.getElementById("totalEmpCount");
        if (totalEl) totalEl.innerText = total;

        // 2. Helper to update bars
        const updateBar = (typeKey, barId, labelId, valId) => {
            const count = counts[typeKey];
            // Calculate percentage (guard against divide by zero)
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);

            // Update Width
            const barEl = document.getElementById(barId);
            if (barEl) barEl.style.width = percent + "%";

            // Update Label Text
            const labelEl = document.getElementById(labelId);
            if (labelEl) labelEl.innerText = `${typeKey} (${percent}%)`;

            // Update Count Value
            const valEl = document.getElementById(valId);
            if (valEl) valEl.innerText = count < 10 ? "0" + count : count;
        };

        // 3. Run updates
        updateBar("WFO", "bar-wfo", "label-wfo", "val-wfo");
        updateBar("WFH", "bar-wfh", "label-wfh", "val-wfh");
        updateBar("Internship", "bar-intern", "label-intern", "val-intern");
    }

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
                    </tr>`;
            });
        }
        if (tableBody) tableBody.innerHTML = html;
    }

    if (triggerEmployeeBtn) {
        triggerEmployeeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            renderTable(EMPLOYEES);
            employeeModal.style.display = "block";
        });
    }

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

    const closeTableModal = () => {
        employeeModal.style.display = "none";
        if (searchInput) searchInput.value = "";
    };
    if (closeEmployeeBtn) closeEmployeeBtn.onclick = closeTableModal;

    // =========================================================
    // 4. FORM LOGIC & SUBMISSION
    // =========================================================
    if (empOpenBtn) empOpenBtn.onclick = () => (empModal.style.display = "flex");
    if (addEmpFromTableBtn) addEmpFromTableBtn.onclick = () => (empModal.style.display = "flex");

    const closeAddModal = () => { empModal.style.display = "none"; };
    
    // Reset form helper
    function resetForm() {
        empForm.reset();
        const inputs = empForm.querySelectorAll("input, select");
        inputs.forEach((input) => input.classList.remove("input-error"));
        const msgs = empForm.querySelectorAll(".error-msg");
        msgs.forEach(msg => msg.style.display = 'none');
    }

    if (empCloseBtn) empCloseBtn.onclick = () => { closeAddModal(); resetForm(); };
    if (empCancelBtn) empCancelBtn.onclick = () => { closeAddModal(); resetForm(); };

    // Validation Helpers
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
            errorDisplay.style.display = "none";
        }
        element.classList.remove("input-error");
    };

    const validateInputs = () => {
        let isValid = true;
        const name = document.getElementById("nameInput");
        const empId = document.getElementById("empIdInput");
        const email = document.getElementById("emailInput");
        const type = document.getElementById("typeInput"); // Ensure type is selected

        if (name.value.trim() === "") { setError(name, "Name required"); isValid = false; } else { setSuccess(name); }
        if (empId.value.trim() === "") { setError(empId, "ID required"); isValid = false; } else { setSuccess(empId); }
        if (email.value.trim() === "") { setError(email, "Email required"); isValid = false; } else { setSuccess(email); }
        if (type.value === "") { setError(type, "Type required"); isValid = false; } else { setSuccess(type); }

        return isValid;
    };

    // --- FORM SUBMIT HANDLER ---
    empForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (validateInputs()) {
            // 1. Gather Values
            const nameVal = document.getElementById("nameInput").value;
            const empIdVal = document.getElementById("empIdInput").value;
            const emailVal = document.getElementById("emailInput").value;
            const jobVal = document.getElementById("jobInput").value;
            const salaryVal = document.getElementById("salaryInput").value;
            const typeVal = document.getElementById("typeInput").value; // "WFO", "WFH", "Internship"

            const empIdNum = parseInt(empIdVal);
            const newEmpId = String(empIdNum).padStart(3, "0");
            // const formattedSalary = salaryVal ? "₹" + parseInt(salaryVal).toLocaleString() : "₹0";

            // 2. Create Object (UI Model)
            // Note: 'type' property is crucial for the stats logic
            const uiEmployee = {
                emp_id: newEmpId,
                name: nameVal,
                email: emailVal,
                position: jobVal || "Not Specified",
                type: typeVal, 
                salary: salaryVal
            };

            // 3. API Object (Backend Model)
            const apiEmployee = {
                name: nameVal,
                employee_id: newEmpId,
                email: emailVal,
                password: document.getElementById("passwordInput").value,
                role: jobVal || "Not Specified",
                salary: salaryVal,
                joining: document.getElementById("dateInput").value,
                department: document.getElementById("deptInput").value, 
                manager_employee: document.getElementById("managerInput").value,
                location: document.getElementById("locationInput").value,
                full_time: typeVal // Assuming backend uses 'full_time' to store type
            };

            // 4. Send to API
            fetch("http://13.51.167.95:8000/api/create/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(apiEmployee)
            })
            .then(res => res.json())
            .then(response => {
                console.log("API Success:", response);
            })
            .catch(err => console.error("API Error:", err));

            // 5. Update Local State & UI IMMEDIATELY
            EMPLOYEES.push(uiEmployee);
            
            updateDashboardStats(); // Updates bars and counts
            renderTable(EMPLOYEES); // Updates table view
            
            // 6. Close Modal & Show Success
            closeAddModal();
            if (successModal) successModal.style.display = "flex"; 
        }
    });

    if (successOkBtn) {
        successOkBtn.onclick = () => {
            successModal.style.display = "none";
            resetForm();
        };
    }

    window.onclick = function (e) {
        if (e.target === empModal) { closeAddModal(); resetForm(); }
        if (e.target === employeeModal && empModal.style.display !== "flex") { closeTableModal(); }
        if (e.target === successModal) { successModal.style.display = "none"; resetForm(); }
    };

    // Initialize stats on load (sets bars to 0%)
    updateDashboardStats();
});


// header icons section
/* --- Toggle the Popup --- */
function hdr_toggleProfilePopup() {
    const dropdown = document.getElementById("hdrProfileDropdown");
    dropdown.classList.toggle("show");
}

/* --- Logout Logic --- */
function hdr_logoutUser() {
    // 1. (Optional) Clear session storage/tokens here
    // sessionStorage.clear();
    // localStorage.clear();

    // 2. Redirect to Login Page
    window.location.href = "../adminlogin/adminlogin.html";
}

/* --- Close Popup when clicking outside --- */
window.onclick = function(event) {
    // If the click is NOT inside the profile wrapper
    if (!event.target.closest(".hdr-profile-wrapper")) {
        const dropdown = document.getElementById("hdrProfileDropdown");
        if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
        }
    }
}


// employee distribution chart
// 1. DATA CONFIGURATION (With updated var names)
const dd_departmentData = [
    { name: "IT & Dev", count: 85, color: "var(--dd-col-it)", class: "dd-bg-it" },
    { name: "Content Writers", count: 120, color: "var(--dd-col-content)", class: "dd-bg-content" },
    { name: "HR Team", count: 25, color: "var(--dd-col-hr)", class: "dd-bg-hr" },
    { name: "Management", count: 15, color: "var(--dd-col-mgmt)", class: "dd-bg-mgmt" }
];

document.addEventListener("DOMContentLoaded", () => {
    // Selectors using Unique Class/IDs
    const dd_svgChart = document.querySelector('.dd-donut-svg');
    const dd_legendList = document.getElementById('ddLegendList');
    const dd_totalDisplay = document.getElementById('ddTotalDisplay');

    // 2. CALCULATE TOTAL
    const total = dd_departmentData.reduce((sum, item) => sum + item.count, 0);
    
    // Animate Total Number
    let currentCount = 0;
    const interval = setInterval(() => {
        const increment = Math.ceil(total / 50);
        currentCount += increment;
        
        if(currentCount >= total) {
            currentCount = total;
            clearInterval(interval);
        }
        dd_totalDisplay.innerText = currentCount;
    }, 20);

    // 3. RENDER CHART & LEGEND
    let cumulativePercent = 0;

    dd_departmentData.forEach(dept => {
        // --- A. Render Legend Item ---
        const percentage = ((dept.count / total) * 100).toFixed(1);
        
        const li = document.createElement('li');
        li.className = 'dd-legend-item';
        li.innerHTML = `
            <div class="dd-item-left">
                <span class="dd-color-dot ${dept.class}"></span>
                <div>
                    <span class="dd-dept-name">${dept.name}</span>
                    <span class="dd-dept-percent">${percentage}%</span>
                </div>
            </div>
            <span class="dd-dept-count">${dept.count}</span>
        `;
        dd_legendList.appendChild(li);

        // --- B. Render SVG Segment ---
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const segmentLength = (dept.count / total) * circumference;
        
        circle.setAttribute("cx", "50");
        circle.setAttribute("cy", "50");
        circle.setAttribute("r", radius);
        circle.setAttribute("class", "dd-donut-segment"); // Unique class
        circle.setAttribute("stroke", dept.color);
        
        // Calculate offset
        const offset = -1 * (cumulativePercent / 100) * circumference;

        // Set initial state for animation
        circle.style.strokeDasharray = `0 ${circumference}`;
        circle.style.strokeDashoffset = offset;
        
        dd_svgChart.appendChild(circle);

        // Trigger Animation
        setTimeout(() => {
            circle.style.strokeDasharray = `${segmentLength} ${circumference}`;
        }, 100);

        cumulativePercent += (dept.count / total) * 100;
    });
});


//attendance graph and details
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURATION ---
    let da_currentTotalEmployees = 50; 
    const da_START_HOUR = 10;
    const da_GRACE_MIN = 10; 
    
    // Selectors
    const da_staffInput = document.getElementById('daStaffCountInput');
    const da_monthSelect = document.getElementById('daMonthSelect');
    const da_yAxis = document.getElementById('daYAxisContainer');
    const da_barsContainer = document.getElementById('daBarsContainer');
    const da_xLabelsContainer = document.getElementById('daXLabelsContainer');
    
    // Stats Elements
    // Note: daAvgOntimeDisplay might be null if you removed it from HTML, so we handle that below
    const da_statOntime = document.getElementById('daAvgOntimeDisplay');
    const da_statLate = document.getElementById('daAvgLateDisplay');
    const da_statAbsent = document.getElementById('daAvgAbsentDisplay');

    // --- 2. UPDATE Y-AXIS VISUALS ---
    function da_updateYAxisLabels() {
        if(!da_yAxis) return;
        da_yAxis.innerHTML = '';
        
        for(let i=0; i<=5; i++) {
            const val = Math.round((da_currentTotalEmployees / 5) * i);
            const span = document.createElement('span');
            span.innerText = val;
            da_yAxis.appendChild(span);
        }
    }

    // --- 3. DATA GENERATOR ---
    function da_generateMonthData(monthIndex) {
        const daysInMonth = new Date(2025, parseInt(monthIndex) + 1, 0).getDate();
        const dailyData = [];

        for (let day = 1; day <= daysInMonth; day++) {
            let dayStats = { day: day, late: 0, ontime: 0, absent: 0 };

            for (let emp = 0; emp < da_currentTotalEmployees; emp++) {
                const rand = Math.random();
                if (rand < 0.10) { 
                    dayStats.absent++;
                } else {
                    const hour = Math.random() > 0.7 ? 10 : 9; 
                    const min = Math.floor(Math.random() * 60);
                    let isLate = false;
                    if (hour > da_START_HOUR) isLate = true;
                    if (hour === da_START_HOUR && min > da_GRACE_MIN) isLate = true;

                    if (isLate) dayStats.late++;
                    else dayStats.ontime++;
                }
            }
            dailyData.push(dayStats);
        }
        return dailyData;
    }

    // --- 4. RENDER LOGIC ---
    function da_runSimulation() {
        da_updateYAxisLabels();

        const monthIndex = da_monthSelect.value;
        const data = da_generateMonthData(monthIndex);
        
        if(da_barsContainer) da_barsContainer.innerHTML = "";
        if(da_xLabelsContainer) da_xLabelsContainer.innerHTML = "";

        let totalLate = 0;
        let totalAbsent = 0;
        let totalOntime = 0;

        data.forEach((dayData, index) => {
            totalLate += dayData.late;
            totalAbsent += dayData.absent;
            totalOntime += dayData.ontime;

            const hLate = (dayData.late / da_currentTotalEmployees) * 100;
            const hOntime = (dayData.ontime / da_currentTotalEmployees) * 100;
            const hAbsent = (dayData.absent / da_currentTotalEmployees) * 100;

            const col = document.createElement('div');
            col.className = 'da-bar-column';
            col.setAttribute('data-tooltip', `Day ${dayData.day}\nOn Time: ${dayData.ontime}\nLate: ${dayData.late}\nAbsent: ${dayData.absent}\nTotal Staff: ${da_currentTotalEmployees}`);

            col.innerHTML = `
                <div class="da-bar-segment da-bg-late" style="height: ${hLate}%"></div>
                <div class="da-bar-segment da-bg-ontime" style="height: ${hOntime}%"></div>
                <div class="da-bar-segment da-bg-absent" style="height: ${hAbsent}%"></div>
            `;
            if(da_barsContainer) da_barsContainer.appendChild(col);

            if (index === 0 || (index + 1) % 5 === 0) {
                const label = document.createElement('div');
                label.className = 'da-x-label-item';
                label.innerText = dayData.day;
                const leftPos = (index / (data.length - 1)) * 100;
                label.style.position = 'absolute';
                if (index === 0) label.style.left = '0%';
                else if (index === data.length - 1) label.style.right = '0%';
                else label.style.left = `${leftPos}%`;
                
                if(da_xLabelsContainer) da_xLabelsContainer.appendChild(label);
            }
        });

        // --- FIX: CHECK IF ELEMENTS EXIST BEFORE UPDATING ---
        const daysCount = data.length;
        
        if(da_statOntime) da_statOntime.innerText = (totalOntime / daysCount).toFixed(0);
        if(da_statLate) da_statLate.innerText = (totalLate / daysCount).toFixed(0);
        if(da_statAbsent) da_statAbsent.innerText = (totalAbsent / daysCount).toFixed(0);
    }

    // --- 5. EVENT LISTENERS ---
    if(da_staffInput) {
        da_staffInput.addEventListener('change', () => {
            const inputVal = da_staffInput.value;
            if(inputVal && inputVal > 0) {
                da_currentTotalEmployees = parseInt(inputVal);
                da_runSimulation(); 
            }
        });
    }

    if(da_monthSelect) {
        da_monthSelect.addEventListener('change', da_runSimulation);
    }

    // --- 6. MODAL LOGIC (New Addition) ---
    const detailModal = document.getElementById("detailModal");
    const triggerBtn = document.querySelector(".attendance-trigger");
    const closeBtn = document.querySelector(".close-btn");

    if(triggerBtn && detailModal) {
        triggerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            // Optional: Populate the modal table here
            populateModalTable(); 
            detailModal.style.display = "flex"; // Using flex to center if CSS is set up
        });
    }

    if(closeBtn && detailModal) {
        closeBtn.addEventListener("click", () => {
            detailModal.style.display = "none";
        });
    }

    // Close when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === detailModal) {
            detailModal.style.display = "none";
        }
    });

    // Helper to add fake data to modal (Visual only)
    function populateModalTable() {
        const tbody = document.getElementById("modalTableBody");
        if(!tbody) return;
        tbody.innerHTML = `
            <tr><td>001</td><td>Dhamodhar K</td><td>2025-10-24</td><td>09:55 - 18:00</td><td>8h 5m</td></tr>
            <tr><td>002</td><td>Saleem</td><td>2025-10-24</td><td>10:15 - 18:00</td><td>7h 45m</td></tr>
            <tr><td>003</td><td>Manikanta</td><td>2025-10-24</td><td>-- : --</td><td>Absent</td></tr>
            <tr><td>003</td><td>Siddarth</td><td>2025-10-24</td><td>-- : --</td><td>Absent</td></tr>
        `;
    }

    // Initial Run
    da_runSimulation();
});

//birthday wihes
document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. DATA ---
    const birthdays = [
        { name: "Dhamodhar", role: "IOS Developer", date: "Today, 24 Oct", rawDate: "2023-10-24", img: "../assets/profiledp.jpeg" },
        { name: "Saleem", role: "UI Designer", date: "Tomorrow, 25 Oct", rawDate: "2023-10-25", img: "../assets/profiledp.jpeg" },
        { name: "Siddarth", role: "Product Manager", date: "26 Oct", rawDate: "2023-10-26", img: "../assets/profiledp.jpeg" },
        { name: "Manikanta", role: "QA Engineer", date: "28 Oct", rawDate: "2023-10-28", img: "../assets/profiledp.jpeg" },
        { name: "Arjun", role: "HR Manager", date: "02 Nov", rawDate: "2023-11-02", img: "../assets/profiledp.jpeg" }
    ];

    let currentIndex = 0;
    let autoSlideInterval;

    // --- 2. CAROUSEL ELEMENTS ---
    const imgEl = document.getElementById("bdayImg");
    const nameEl = document.getElementById("bdayName");
    const roleEl = document.getElementById("bdayRole");
    const dateEl = document.getElementById("bdayDate");
    const container = document.getElementById("bdayProfileContainer");
    const bdayCard = document.querySelector(".birthday-card");

    // --- 3. CAROUSEL LOGIC ---
    function updateCarousel(index) {
        if(!container) return;
        container.classList.remove("fade-in");
        void container.offsetWidth; 
        const person = birthdays[index];
        if(imgEl) imgEl.src = person.img;
        if(nameEl) nameEl.innerText = person.name;
        if(roleEl) roleEl.innerText = person.role;
        if(dateEl) dateEl.innerText = person.date;
        container.classList.add("fade-in");
    }

    // --- 4. AUTO SLIDE LOGIC ---
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % birthdays.length;
            updateCarousel(currentIndex);
        }, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    if(bdayCard) {
        bdayCard.addEventListener("mouseenter", stopAutoSlide);
        bdayCard.addEventListener("mouseleave", startAutoSlide);
    }

    // --- 5. NAVIGATION BUTTONS ---
    const nextBtn = document.getElementById("nextBdayBtn");
    const prevBtn = document.getElementById("prevBdayBtn");

    if(nextBtn) nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % birthdays.length;
        updateCarousel(currentIndex);
        stopAutoSlide(); 
        if(!bdayCard.matches(':hover')) startAutoSlide();
    });

    if(prevBtn) prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + birthdays.length) % birthdays.length;
        updateCarousel(currentIndex);
        stopAutoSlide();
        if(!bdayCard.matches(':hover')) startAutoSlide();
    });

    // --- 6. WISH MODAL & SUCCESS MODAL LOGIC ---
    const wishModal = document.getElementById("wishModal");
    const wishTargetName = document.getElementById("wishTargetName");
    const wishMessage = document.getElementById("wishMessage");
    const successWishModal = document.getElementById("successWishModal"); // Success Modal
    const successName = document.getElementById("successName"); // Name in success modal

    window.openWishModal = function(identifier) {
        stopAutoSlide();
        let name = "";
        if (identifier === 'current') {
            name = birthdays[currentIndex].name;
        } else {
            name = identifier;
        }

        if(wishTargetName) wishTargetName.innerText = name;
        if(wishMessage) wishMessage.value = ""; 
        if(wishModal) wishModal.classList.add("active");
    };

    window.closeWishModal = function() {
        if(wishModal) wishModal.classList.remove("active");
        if(bdayCard && !bdayCard.matches(':hover')) {
            startAutoSlide();
        }
    };

    // --- UPDATED SUBMIT FUNCTION WITH SUCCESS POPUP ---
    window.submitWish = function() {
        const btn = document.querySelector(".btn-send-wish");
        const originalText = btn.innerHTML;
        
        // 1. Loading State
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        
        setTimeout(() => {
            // 2. Get the name we just wished
            const currentName = wishTargetName.innerText;

            // 3. Close the input modal
            closeWishModal();

            // 4. Reset Button
            btn.innerHTML = originalText;
            
            // 5. Open Success Modal
            openSuccessWishModal(currentName);
        }, 800);
    };

    // --- SUCCESS MODAL FUNCTIONS ---
    window.openSuccessWishModal = function(name) {
        if(successName) successName.innerText = name;
        if(successWishModal) successWishModal.classList.add("active");
    };

    window.closeSuccessWishModal = function() {
        if(successWishModal) successWishModal.classList.remove("active");
    };

    // --- 7. VIEW ALL MODAL LOGIC ---
    const allBdayModal = document.getElementById("allBirthdaysModal");
    const listContainer = document.getElementById("bdayListContainer");

    window.openAllBirthdaysModal = function() {
        stopAutoSlide();
        if(listContainer) {
            listContainer.innerHTML = "";
            birthdays.forEach(person => {
                const item = document.createElement("div");
                item.className = "bday-item";
                item.innerHTML = `
                    <div class="bday-left">
                        <img src="${person.img}" alt="${person.name}">
                        <div class="bday-info">
                            <h4>${person.name}</h4>
                            <span>${person.date} - ${person.role}</span>
                        </div>
                    </div>
                    <button class="btn-mini-wish" onclick="openWishModal('${person.name}')">
                        Wish
                    </button>
                `;
                listContainer.appendChild(item);
            });
        }
        if(allBdayModal) allBdayModal.classList.add("active");
    };

    window.closeAllBirthdaysModal = function() {
        if(allBdayModal) allBdayModal.classList.remove("active");
        if(bdayCard && !bdayCard.matches(':hover')) {
            startAutoSlide();
        }
    };

    // --- 8. CLOSE ON CLICK OUTSIDE (Updated for Success Modal) ---
    window.onclick = function(event) {
        if (event.target === wishModal) closeWishModal();
        if (event.target === allBdayModal) closeAllBirthdaysModal();
        if (event.target === successWishModal) closeSuccessWishModal();
    };

    // --- INITIALIZATION ---
    updateCarousel(currentIndex);
    startAutoSlide();
});


//holidays section
// --- 1. Initial Data ---
let holidays = [
    { name: 'Republic Day', date: '2025-01-26', type: 'Public Holiday' },
    { name: 'Holi', date: '2025-03-14', type: 'Public Holiday' },
    { name: 'Good Friday', date: '2025-04-18', type: 'Optional Holiday' },
    { name: 'Independence Day', date: '2025-08-15', type: 'Public Holiday' },
    { name: 'Diwali', date: '2025-10-20', type: 'Public Holiday' }
];

// --- 2. Element Selectors ---
const holidayListModal = document.getElementById('hraHolidayListModal');
const holidayAddModal = document.getElementById('hraAddHolidayModal');
const tableBody = document.getElementById('hraHolidayTableBody');
const successPopup = document.getElementById('hraSuccessPopup');

// --- 3. Helper Functions ---

// Format Date for display (e.g., "20 Oct 2025")
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    });
}

// Get Day Name (e.g., "Monday")
function getDayName(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Update the Card to show the *next* upcoming holiday
function updateCard() {
    const today = new Date().toISOString().split('T')[0];
    
    // Sort array by date
    const sortedHolidays = holidays.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Find first date >= today
    const nextHoliday = sortedHolidays.find(h => h.date >= today);
    
    const textElement = document.getElementById('hraNextHolidayText');
    if (nextHoliday) {
        textElement.textContent = `${nextHoliday.name}, ${formatDate(nextHoliday.date)}`;
    } else {
        textElement.textContent = "No upcoming holidays";
    }
}

// Render the table in the "View All" popup
function renderTable() {
    tableBody.innerHTML = '';
    // Sort by date
    holidays.sort((a, b) => new Date(a.date) - new Date(b.date));

    holidays.forEach(h => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight:600;">${formatDate(h.date)}</td>
            <td style="color: #6b7280;">${getDayName(h.date)}</td>
            <td>${h.name}</td>
            <td><span style="background:#f3f4f6; padding:4px 8px; border-radius:4px; font-size:0.8rem;">${h.type}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Show Success Toast
function showSuccess() {
    successPopup.classList.add('hra-show');
    setTimeout(() => {
        successPopup.classList.remove('hra-show');
    }, 3000);
}

// --- 4. Event Listeners ---

// Initialize Card on Load
document.addEventListener('DOMContentLoaded', updateCard);

// OPEN "View All" Modal
document.getElementById('hraViewHolidayBtn').addEventListener('click', () => {
    renderTable();
    holidayListModal.style.display = 'flex';
});

// CLOSE "View All" Modal
document.getElementById('hraCloseHolidayList').addEventListener('click', () => {
    holidayListModal.style.display = 'none';
});

// OPEN "Add Holiday" Modal (sits on top of list)
document.getElementById('hraOpenAddHolidayBtn').addEventListener('click', () => {
    holidayAddModal.style.display = 'flex';
});

// CLOSE "Add Holiday" Modal
document.getElementById('hraCloseAddHoliday').addEventListener('click', () => {
    holidayAddModal.style.display = 'none';
});

// SUBMIT Form
document.getElementById('hraHolidayForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Get Values
    const name = document.getElementById('hraHolidayName').value;
    const date = document.getElementById('hraHolidayDate').value;
    const type = document.getElementById('hraHolidayType').value;

    // 2. Add to Array
    holidays.push({ name, date, type });

    // 3. Update UI
    renderTable(); // Update List Modal
    updateCard();  // Update Main Card

    // 4. Close Form & Reset
    holidayAddModal.style.display = 'none';
    document.getElementById('hraHolidayForm').reset();

    // 5. Show Success
    showSuccess();
});

// Close Modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target == holidayListModal) holidayListModal.style.display = 'none';
    if (e.target == holidayAddModal) holidayAddModal.style.display = 'none';
});


//calender section
document.addEventListener("DOMContentLoaded", function() {
    
    // Select Elements
    const btn = document.getElementById("dateTriggerBtn");
    const displaySpan = document.getElementById("dateDisplay");
    const dateInput = document.getElementById("nativeDatePicker");

    // 1. Function to format date as "DD Mon YYYY" (e.g., 14 Feb 2026)
    function formatDate(dateObj) {
        return dateObj.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    // 2. Set Initial Date (Today)
    const today = new Date();
    displaySpan.innerText = formatDate(today);

    // 3. Open Calendar when Button is Clicked
    btn.addEventListener("click", function() {
        try {
            // Modern Browsers
            dateInput.showPicker(); 
        } catch (error) {
            // Fallback
            dateInput.focus();
            dateInput.click();
        }
    });

    // 4. Update Button Text on Date Selection
    dateInput.addEventListener("change", function() {
        // Create date object from input value
        // Note: input.value is YYYY-MM-DD
        if (this.value) {
            const selectedDate = new Date(this.value);
            displaySpan.innerText = formatDate(selectedDate);
        }
    });

});


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
