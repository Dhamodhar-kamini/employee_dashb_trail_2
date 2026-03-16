document.addEventListener("DOMContentLoaded", function () {
  let currentEmpData = null;
  let originalEmpId = null;

  // ==================================================
  // --- 1. INITIALIZATION & DATA NORMALIZATION ---
  // ==================================================
  const emp_id = localStorage.getItem("employee_id");
  console.log("Current Employee ID:", emp_id);
  
  if (!emp_id) {
    alert("No employee selected.");
    window.history.back();
    return;
  }

  // Fetch Main Dashboard Info
  fetch(`http://13.51.167.95:8000/api/employee/dashboard/${emp_id}/`)
    .then(res => res.json())
    .then(data => {
      currentEmpData = data; 
      console.log('Main Employee Data:', data);
      
      document.getElementById('p_name').innerText = data.name || "N/A";
      document.getElementById('p_role').innerText = data.role || "N/A";
      document.getElementById('p_dept').innerText = data.department || "N/A";
      document.getElementById('p_id').innerText = `EMP-${data.employee_id || emp_id}`;
      document.getElementById('p_join').innerText = data.joining || "N/A";
      document.getElementById('p_salary').innerText = data.salary ? `₹${data.salary}` : "N/A";
      document.getElementById('p_email').innerText = data.email || "N/A";
      
      // Safely access nested array data
      if (data.other_details && data.other_details.length > 0) {
        document.getElementById('p_phone').innerText = data.other_details[0].mobile || "N/A";
        document.getElementById('p_location').innerText = data.other_details[0].address || "N/A";
      }
    })
    .catch(err => console.error("Error fetching main data:", err));

  // Inject modals/popups (once)
  injectEditModal();
  injectPayrollModal(); 
  injectSuccessPopup();

  // Bind buttons
  bindEditProfileButtons();
  bindDownloadButtonIfPresent();


  // ==================================================
  // --- 2. FETCH LEAVES ---
  // ==================================================
  const leave_table = document.getElementById('leavebody');
  fetch(`http://13.51.167.95:8000/api/employee/apply-leave/${emp_id}/`)
    .then(res => res.json())
    .then(data => {
        if (leave_table) {
            leave_table.innerHTML = "";
            if (!data || data.length === 0) {
                leave_table.innerHTML = `<tr><td colspan="5" style="text-align:center;">No leaves found</td></tr>`;
                return;
            }
            data.forEach(p => {
                // Determine color based on status
                let statusColor = p.status === 'approved' ? 'color: #2ecc71;' : (p.status === 'rejected' ? 'color: #e74c3c;' : 'color: #f39c12;');
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${p.leave_type.toUpperCase()}</td>
                    <td>${p.from_date}</td>
                    <td>${p.to_date}</td>
                    <td>${p.number_of_days}</td>
                    <td style="font-weight:bold; ${statusColor}">${p.status.toUpperCase()}</td>
                `;
                leave_table.appendChild(row);
            });
        }
    })
    .catch(err => console.error("Error fetching leaves:", err));


  // ==================================================
  // --- 3. FETCH DOCUMENTS ---
  // ==================================================
  function fetchDocuments() {
    fetch(`http://13.51.167.95:8000/api/employee-documents/${emp_id}/`)
      .then(res => res.json())
      .then(data => {
        const docsGrid = document.getElementById("documentsGrid");
        if (!docsGrid) return;
        docsGrid.innerHTML = "";

        if(!data || data.length === 0){
          docsGrid.innerHTML = "<p>No documents uploaded</p>";
          return;
        }

        data.forEach(doc => {
          const fileUrl = `http://13.51.167.95:8000${doc.file}`; // Ensured port is attached to URL
          const card = `
          <div class="doc-card">
            <div class="doc-header">
              <i class="fa-regular fa-file-pdf doc-icon"></i>
              <span class="file-size">DOC</span>
            </div>
            <div class="doc-info">
              <h4>
                <a href="${fileUrl}" target="_blank">${doc.description}</a>
              </h4>
              <p class="doc-type">${doc.doc_type}</p>
              <p class="upload-date">Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}</p>
            </div>
          </div>
          `;
          docsGrid.innerHTML += card;
        });
      })
      .catch(err => console.error("Error:", err));
  }


  // ==================================================
  // --- 4. FETCH ATTENDANCE (NEW) ---
  // ==================================================
  function fetchAttendance() {
    // Target the tbody inside the attendance tab directly
    const attendanceBody = document.querySelector('#attendance tbody');
    if (!attendanceBody) return;

    fetch(`http://13.51.167.95:8000/api/employee-attendence-history/${emp_id}/`)
      .then(res => res.json())
      .then(data => {
          attendanceBody.innerHTML = ""; // Clear hardcoded data
          
          if (!data || data.length === 0) {
              attendanceBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No attendance records found</td></tr>`;
              return;
          }

          data.forEach(record => {
              const dateObj = new Date(record.date);
              const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

              let clockIn = "--"; let clockOut = "--"; let hoursWorked = "0";
              let status = "absent"; let statusClass = "absent"; 

              if (record.checkin) {
                  const checkInDate = new Date(record.checkin);
                  clockIn = checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                  
                  // Logic for late vs present
                  if (checkInDate.toTimeString().split(' ')[0] > "10:10:00") {
                      status = "late"; statusClass = "late";
                  } else {
                      status = "present"; statusClass = "present";
                  }
              }

              if (record.checkout) {
                  const checkOutDate = new Date(record.checkout);
                  clockOut = checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                  if (record.checkin) {
                      const diffMs = checkOutDate - new Date(record.checkin);
                      hoursWorked = (diffMs / (1000 * 60 * 60)).toFixed(1);
                  }
              } else if (record.checkin) {
                   hoursWorked = "Ongoing";
              }

              attendanceBody.innerHTML += `
                  <tr>
                      <td>${formattedDate}</td>
                      <td>${clockIn}</td>
                      <td>${clockOut}</td>
                      <td>${hoursWorked}</td>
                      <td><span class="status-pill ${statusClass}">${status}</span></td>
                  </tr>
              `;
          });
      })
      .catch(err => console.error("Error fetching attendance:", err));
  }


  // ==================================================
  // --- 5. FETCH PAYROLL (NEW) ---
  // ==================================================
  function fetchPayroll() {
    const payrollTab = document.getElementById('payroll');
    if (!payrollTab) return;

    fetch(`http://13.51.167.95:8000/api/employee-payslips/${emp_id}/`)
      .then(res => res.json())
      .then(data => {
          // Rewrite the payroll tab inner HTML, keeping the header and clearing hardcoded cards
          payrollTab.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 class="section-title" style="margin: 0">Salary History</h3>
            </div>
            <div id="dynamic-payroll-container"></div>
          `;
          
          const container = document.getElementById('dynamic-payroll-container');

          if (!data || data.length === 0) {
              container.innerHTML = `<p style="text-align:center; padding:20px;">No payslip records found.</p>`;
              return;
          }

          data.forEach(pay => {
              container.innerHTML += `
                <div class="salary-card" style="margin-bottom: 20px;">
                  <div class="salary-header">
                    <h4>${pay.month}</h4>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span class="status-badge paid">Processed</span>
                      <button onclick="window.admOpenPayrollModal()" style="border:none; background: #e5e7eb; color:#374151; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                        <i class="fa-solid fa-pen"></i> Edit
                      </button>
                    </div>
                  </div>
                  <div class="salary-details">
                    <div class="detail-item"><label>Basic</label><div class="amount">₹${pay.basic_salary || '0'}</div></div>
                    <div class="detail-item"><label>HRA</label><div class="amount">₹${pay.hra || '0'}</div></div>
                    <div class="detail-item"><label>DA</label><div class="amount">₹${pay.da || '0'}</div></div>
                    <div class="detail-item"><label>Gross</label><div class="amount">₹${pay.gross_salary || '0'}</div></div>
                    <div class="detail-item"><label>PF Deduction</label><div class="amount">₹${pay.pf_amount || '0'}</div></div>
                    <div class="detail-item"><label>Prof. Tax</label><div class="amount">₹${pay.professional_tax || '0'}</div></div>
                    <div class="detail-item"><label>LOP Days</label><div class="amount">${pay.lop_days || '0'}</div></div>
                    <div class="detail-item highlight"><label>Net Pay</label><div class="amount">₹${pay.net_salary || '0'}</div></div>
                  </div>
                </div>
              `;
          });
      })
      .catch(err => console.error("Error fetching payroll:", err));
  }

  // EXECUTE ALL API CALLS
  fetchDocuments();
  fetchAttendance();
  fetchPayroll();


  // ==================================================
  // --- 6. UTILITY FUNCTIONS (Defaults & Normalization) ---
  // ==================================================
  function normalizeEmployee(emp) {
    const e = emp || {};
    e.id = e.id || "EMP-000";
    e.name = e.name || "Unknown";
    
    if (!e.leaveBalance || typeof e.leaveBalance !== "object") e.leaveBalance = {};
    if (!e.bankDetails || typeof e.bankDetails !== "object") e.bankDetails = {};
    if (!e.statutoryDetails || typeof e.statutoryDetails !== "object") e.statutoryDetails = {};
    if (!e.payroll || typeof e.payroll !== "object") e.payroll = {};
    
    e.isSalaryHeld = !!e.isSalaryHeld;
    e.isLoginDisabled = !!e.isLoginDisabled;
    e.status = e.status || "Active";
    return e;
  }

  function toIntOrDefault(v, def) {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
  }

  // ==================================================
  // --- 7. TAB SWITCHING LOGIC ---
  // ==================================================
  window.switchTab = function (tabName, evt) {
    const e = evt || window.event;
    const allTabs = document.querySelectorAll(".tab-item");
    allTabs.forEach((tab) => tab.classList.remove("active"));
    if (e && e.currentTarget) e.currentTarget.classList.add("active");
    
    const allContent = document.querySelectorAll(".tab-content");
    allContent.forEach((content) => (content.style.display = "none"));
    
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) selectedContent.style.display = "block";
  };

  // ==================================================
  // --- 8. ADMIN ACTIONS ---
  // ==================================================
  window.admOpenModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("adm-show");
  };

  window.admCloseModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("adm-show");
  };

  window.admPerformAction = function (actionType) {
    alert("Admin Action Triggered: " + actionType);
    document.querySelectorAll('.adm-modal-overlay').forEach(el => el.classList.remove("adm-show"));
  };


  // ==================================================
  // --- 9. EDIT PROFILE MODAL ---
  // ==================================================
  function bindEditProfileButtons() {
    const editBtn = document.getElementById("editProfileBtn");
    if (editBtn) {
      editBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.admOpenEditModal();
      });
    }
  }

  function looksLikeEditButton(btn) {
    const txt = (btn.textContent || "").toLowerCase();
    if (txt.includes("edit")) return true;
    if (btn.querySelector(".fa-pen-to-square, .fa-pen, .fa-edit")) return true;
    return false;
  }

  function injectEditModal() {
    if (document.getElementById("admEditModal")) return;
    const overlay = document.createElement("div");
    overlay.id = "admEditModal";
    overlay.className = "adm-modal-overlay";
    overlay.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,.45); display: none; align-items: center; justify-content: center; padding: 18px; z-index: 9999;`;
    const modal = document.createElement("div");
    modal.className = "adm-modal";
    modal.style.cssText = `width: min(920px, 100%); background: #fff; border-radius: 18px; padding: 18px; box-shadow: 0 18px 45px rgba(0,0,0,.28); max-height: 85vh; overflow: auto; scrollbar-width: none; -ms-overflow-style: none; font-family: inherit;`;

    modal.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div><div style="font-size:18px;font-weight:900;">Edit Employee Profile</div></div>
        <button type="button" id="admEditCloseX" style="border:none;background:#f3f4f6;border-radius:12px;padding:8px 10px;cursor:pointer;font-weight:900;">✕</button>
      </div>
      <div style="height:1px;background:#eef2f7;margin:14px 0;"></div>
      <form id="admEditForm">
        <div style="font-weight:900;color:#111827;margin:8px 0 10px 0;">Profile</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Employee ID</label><input id="edit_id" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Name *</label><input id="edit_name" type="text" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Role</label><input id="edit_role" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Department</label><input id="edit_dept" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
          <button type="button" id="admEditCancel" style="padding:10px 14px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-weight:800;">Cancel</button>
          <button type="submit" id="admEditSave" style="padding:10px 14px;border-radius:12px;border:none;background:linear-gradient(135deg,#111827,#334155);color:#fff;cursor:pointer;font-weight:900;">Save Changes</button>
        </div>
      </form>`;
      
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    modal.querySelector("#admEditCloseX").addEventListener("click", () => window.admCloseEditModal());
    modal.querySelector("#admEditCancel").addEventListener("click", () => window.admCloseEditModal());
    modal.querySelector("#admEditForm").addEventListener("submit", function (e) {
      e.preventDefault();
      window.admSaveEditEmployee();
    });

    const origAdd = overlay.classList.add.bind(overlay.classList);
    overlay.classList.add = function (...args) {
      if (args.includes("adm-show")) overlay.style.display = "flex";
      return origAdd(...args);
    };
    const origRemove = overlay.classList.remove.bind(overlay.classList);
    overlay.classList.remove = function (...args) {
      if (args.includes("adm-show")) overlay.style.display = "none";
      return origRemove(...args);
    };
  }

  window.admOpenEditModal = function () {
    const overlay = document.getElementById("admEditModal");
    if (!overlay) return;
    overlay.classList.add("adm-show");
  };

  window.admCloseEditModal = function () {
    const overlay = document.getElementById("admEditModal");
    if (overlay) overlay.classList.remove("adm-show");
  };

  window.admSaveEditEmployee = function () {
    window.admCloseEditModal();
    showSuccessPopup("Profile update request sent!");
  };

  // ==================================================
  // --- 10. PAYROLL MODAL (NEW) ---
  // ==================================================
  function injectPayrollModal() {
    if (document.getElementById("admPayrollModal")) return;

    const overlay = document.createElement("div");
    overlay.id = "admPayrollModal";
    overlay.className = "adm-modal-overlay";
    overlay.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,.45); display: none; align-items: center; justify-content: center; padding: 18px; z-index: 9999;`;

    const modal = document.createElement("div");
    modal.className = "adm-modal";
    modal.style.cssText = `width: min(500px, 100%); background: #fff; border-radius: 18px; padding: 18px; box-shadow: 0 18px 45px rgba(0,0,0,.28); overflow: auto; font-family: inherit;`;

    modal.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="font-size:18px;font-weight:900;">Edit Salary History</div>
        <button type="button" id="admPayrollCloseX" style="border:none;background:#f3f4f6;border-radius:12px;padding:8px 10px;cursor:pointer;font-weight:900;">✕</button>
      </div>
      <div style="height:1px;background:#eef2f7;margin:14px 0;"></div>
      <form id="admPayrollForm">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
           <div style="grid-column: 1 / -1;"><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Basic Pay</label><input id="pay_in_basic" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
           <div style="grid-column: 1 / -1;"><label style="display:block;font-size:12px;color:#10b981;font-weight:700;margin-bottom:6px;">Net Pay</label><input id="pay_in_net" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #10b981;border-radius:12px;background:#ecfdf5;font-weight:700;" /></div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
          <button type="button" id="admPayrollCancel" style="padding:10px 14px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-weight:800;">Cancel</button>
          <button type="submit" style="padding:10px 14px;border-radius:12px;border:none;background:linear-gradient(135deg,#111827,#334155);color:#fff;cursor:pointer;font-weight:900;">Save Changes</button>
        </div>
      </form>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector("#admPayrollCloseX").addEventListener("click", () => window.admClosePayrollModal());
    modal.querySelector("#admPayrollCancel").addEventListener("click", () => window.admClosePayrollModal());
    modal.querySelector("#admPayrollForm").addEventListener("submit", function (e) {
      e.preventDefault();
      window.admSavePayroll();
    });

    const origAdd = overlay.classList.add.bind(overlay.classList);
    overlay.classList.add = function (...args) {
      if (args.includes("adm-show")) overlay.style.display = "flex";
      return origAdd(...args);
    };
    const origRemove = overlay.classList.remove.bind(overlay.classList);
    overlay.classList.remove = function (...args) {
      if (args.includes("adm-show")) overlay.style.display = "none";
      return origRemove(...args);
    };
  }

  window.admOpenPayrollModal = function () {
    const overlay = document.getElementById("admPayrollModal");
    if (!overlay) return;
    overlay.classList.add("adm-show");
  };

  window.admClosePayrollModal = function () {
    const overlay = document.getElementById("admPayrollModal");
    if (overlay) overlay.classList.remove("adm-show");
  };

  window.admSavePayroll = function () {
    window.admClosePayrollModal();
    showSuccessPopup("Salary history update request sent!");
  };

  // ==================================================
  // --- 11. SUCCESS POPUP ---
  // ==================================================
  function injectSuccessPopup() {
    if (document.getElementById("admSuccessPopup")) return;
    const el = document.createElement("div");
    el.id = "admSuccessPopup";
    el.style.cssText = `position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(17,24,39,.35); z-index: 10000; padding: 16px;`;
    el.innerHTML = `
      <div style="width: min(420px, 100%); background: #ffffff; border-radius: 18px; box-shadow: 0 22px 60px rgba(0,0,0,.28); overflow: hidden; transform: translateY(8px); opacity: 0; transition: .18s ease;" id="admSuccessCard">
        <div style="padding:16px 16px 12px 16px; background: linear-gradient(135deg,#10b981,#22c55e); color:#fff;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="font-weight:900; font-size:16px;">Success</div>
            <button id="admSuccessClose" type="button" style="border:none;background:rgba(255,255,255,.18);color:#fff;border-radius:12px;padding:6px 10px;cursor:pointer;font-weight:900;">✕</button>
          </div>
        </div>
        <div style="padding:16px;">
          <div style="display:flex; gap:12px; align-items:flex-start;">
            <div style="width: 42px; height: 42px; border-radius: 14px; background: #dcfce7; color: #166534; display:flex; align-items:center; justify-content:center; font-size: 20px; font-weight: 900;">✓</div>
            <div><div id="admSuccessMsg" style="font-weight:900; color:#111827; font-size:14px; line-height:1.35;">Updated successfully</div><div style="color:#6b7280; font-size:12px; margin-top:4px;">Changes have been saved.</div></div>
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:14px;">
            <button id="admSuccessOk" type="button" style="border:none;background:#111827;color:#fff;padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:900;">OK</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector("#admSuccessClose").addEventListener("click", hideSuccessPopup);
    el.querySelector("#admSuccessOk").addEventListener("click", hideSuccessPopup);
    el.addEventListener("click", function (e) {
      if (e.target === el) hideSuccessPopup();
    });
  }

  let successTimer = null;
  function showSuccessPopup(message) {
    const overlay = document.getElementById("admSuccessPopup");
    const card = document.getElementById("admSuccessCard");
    const msg = document.getElementById("admSuccessMsg");
    if (!overlay || !card || !msg) return;
    msg.textContent = message || "Updated successfully";
    overlay.style.display = "flex";
    requestAnimationFrame(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0px)";
    });
    if (successTimer) clearTimeout(successTimer);
    successTimer = setTimeout(hideSuccessPopup, 1700);
  }

  function hideSuccessPopup() {
    const overlay = document.getElementById("admSuccessPopup");
    const card = document.getElementById("admSuccessCard");
    if (!overlay || !card) return;
    card.style.opacity = "0";
    card.style.transform = "translateY(8px)";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 160);
  }

  // ==================================================
  // --- 12. DOWNLOAD LOGIC ---
  // ==================================================
  const downloadModal = document.getElementById("downloadModal");
  function bindDownloadButtonIfPresent() {
    const downloadBtn = document.getElementById("downloadProfileBtn");
    if (!downloadBtn) return;
    downloadBtn.addEventListener("click", function () {
      if (downloadModal) downloadModal.classList.add("active");
    });
  }

  window.closeDownloadModal = function () {
    if (downloadModal) downloadModal.classList.remove("active");
  };

  window.downloadAsCSV = function () {
    alert("Downloading CSV...");
    window.closeDownloadModal();
  };

  window.downloadAsPDF = function () {
    window.closeDownloadModal();
    const element = document.querySelector(".main-container");
    const controls = document.querySelectorAll(".top-nav, .header-actions, .tabs-container, .adm-actions-grid");
    controls.forEach((el) => (el.style.display = "none"));
    const opt = {
      margin: 0.3,
      filename: `Employee_Profile.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    if (typeof html2pdf !== "undefined") {
      html2pdf().set(opt).from(element).save()
        .then(() => controls.forEach((el) => (el.style.display = "")))
        .catch(() => controls.forEach((el) => (el.style.display = "")));
    } else {
      alert("PDF Library not loaded. Please include html2pdf.js");
      controls.forEach((el) => (el.style.display = ""));
    }
  };

  window.onclick = function (event) {
    if (event.target && event.target.classList && event.target.classList.contains("adm-modal-overlay")) {
      event.target.classList.remove("adm-show");
    }
    if (event.target === downloadModal) {
      window.closeDownloadModal();
    }
  };
});