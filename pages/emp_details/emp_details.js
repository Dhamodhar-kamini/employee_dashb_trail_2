document.addEventListener("DOMContentLoaded", function () {
  let currentEmpData = null;
  let originalEmpId = null;

  // ==================================================
  // --- 1. INITIALIZATION & DATA NORMALIZATION ---
  // ==================================================
  const emp_id = localStorage.getItem("employee_id");
  console.log(emp_id)
  
    fetch(`http://13.51.167.95:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
          currentEmpData = data; 
          console.log('data:',data)
          document.getElementById('p_name').innerText=data.name
          document.getElementById('p_role').innerText=data.role
          document.getElementById('p_dept').innerText=data.department
          document.getElementById('p_id').innerText=`EMP-${data.employee_id}`
          document.getElementById('p_join').innerText=data.joining
          document.getElementById('p_salary').innerText=data.salary
          document.getElementById('p_email').innerText=data.email
          document.getElementById('p_phone').innerText=data.other_details[0].mobile
          document.getElementById('p_location').innerText=data.other_details[0].address
        })
  // if (storedData) {
  //   currentEmpData = normalizeEmployee(JSON.parse(storedData));
  //   originalEmpId = currentEmpData.id;
    
  //   // re-save normalized version
  //   localStorage.setItem("viewEmployeeData", JSON.stringify(currentEmpData));

  //   populateUI(currentEmpData);
  //   admUpdateUIState();
  // } else {
  //   alert("No employee selected.");
  //   window.history.back();
  //   return;
  // }

  // Inject modals/popups (once)
  injectEditModal();
  injectPayrollModal(); // NEW: Inject Payroll Modal
  injectSuccessPopup();

  // Bind buttons
  bindEditProfileButtons();
  bindDownloadButtonIfPresent();

  function normalizeEmployee(emp) {
    const e = emp || {};

    // Basic defaults
    e.id = e.id || "EMP-000";
    e.name = e.name || "Unknown";

    // Leave Balance defaults
    if (!e.leaveBalance || typeof e.leaveBalance !== "object") e.leaveBalance = {};
    e.leaveBalance.sick = toIntOrDefault(e.leaveBalance.sick, 0);
    e.leaveBalance.casual = toIntOrDefault(e.leaveBalance.casual, 0);
    e.leaveBalance.privilege = toIntOrDefault(e.leaveBalance.privilege, 0);
    e.leaveBalance.maternity = toIntOrDefault(e.leaveBalance.maternity, 0);
    e.leaveBalance.compOff = toIntOrDefault(e.leaveBalance.compOff, 0);

    // Bank details defaults
    if (!e.bankDetails || typeof e.bankDetails !== "object") e.bankDetails = {};
    e.bankDetails.bankName = (e.bankDetails.bankName ?? "").toString();
    e.bankDetails.accountNumber = (e.bankDetails.accountNumber ?? "").toString();
    e.bankDetails.ifsc = (e.bankDetails.ifsc ?? "").toString();

    // Statutory Information Defaults
    if (!e.statutoryDetails || typeof e.statutoryDetails !== "object") e.statutoryDetails = {};
    e.statutoryDetails.pan = (e.statutoryDetails.pan ?? "-NA-").toString();
    e.statutoryDetails.uan = (e.statutoryDetails.uan ?? "-NA-").toString();
    e.statutoryDetails.pt = (e.statutoryDetails.pt ?? "-NA-").toString();
    e.statutoryDetails.lwf = (e.statutoryDetails.lwf ?? "-NA-").toString();
    e.statutoryDetails.esicStatus = (e.statutoryDetails.esicStatus ?? "-NA-").toString();
    e.statutoryDetails.esicIp = (e.statutoryDetails.esicIp ?? "-NA-").toString();

    // Payroll Defaults (NEW)
    if (!e.payroll || typeof e.payroll !== "object") e.payroll = {};
    e.payroll.basic = toIntOrDefault(e.payroll.basic, 42500);
    e.payroll.hra = toIntOrDefault(e.payroll.hra, 17000);
    e.payroll.da = toIntOrDefault(e.payroll.da, 8500);
    e.payroll.gross = toIntOrDefault(e.payroll.gross, 70850);
    e.payroll.pf = toIntOrDefault(e.payroll.pf, 5100);
    e.payroll.tax = toIntOrDefault(e.payroll.tax, 8500);
    e.payroll.deductions = toIntOrDefault(e.payroll.deductions, 1250);
    e.payroll.net = toIntOrDefault(e.payroll.net, 56000);

    // Admin flags defaults
    e.isSalaryHeld = !!e.isSalaryHeld;
    e.isLoginDisabled = !!e.isLoginDisabled;
    e.status = e.status || "Active";

    return e;
  }

  function toIntOrDefault(v, def) {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
  }

  function formatCurrency(num) {
    return "₹" + Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // ==================================================
  // --- 2. UI POPULATION ---
  // ==================================================
  function populateUI(emp) {
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text || "-";
    };


    Header
    setText("p_name", emp.name);
    setText("p_role", emp.role);
    setText("p_dept", emp.department);
    setText(
      "p_initials",
      emp.name
        ? emp.name.split(" ").filter(Boolean).map((n) => n[0]).join("").substring(0, 2).toUpperCase()
        : "NA"
    );

    // Overview Tab
    setText("p_id", emp.id);
    setText("p_join", emp.joining);
    setText("p_salary", emp.salary);
    setText("p_email", emp.email);
    setText("p_phone", emp.mobile);
    setText("p_location", emp.location);

    // Details
    setText("p_dept_2", emp.dept);
    setText("p_role_2", emp.role);
    setText("p_marital", emp.maritalStatus || "Single");

    updateStatusBadge(emp.status);

    // Leave Balance & Statutory & Bank (using label search)
    updateValueByLabel("Sick Leave", `${emp.leaveBalance.sick} days`);
    updateValueByLabel("Casual Leave", `${emp.leaveBalance.casual} days`);
    updateValueByLabel("Privilege Leave", `${emp.leaveBalance.privilege} days`);
    updateValueByLabel("Maternity Leave", `${emp.leaveBalance.maternity} days`);
    updateValueByLabel("Comp Off", `${emp.leaveBalance.compOff} days`);

    updateValueByLabel("PAN", emp.statutoryDetails.pan);
    updateValueByLabel("PAN UAN", emp.statutoryDetails.uan);
    updateValueByLabel("Professional Tax", emp.statutoryDetails.pt);
    updateValueByLabel("LWF Status", emp.statutoryDetails.lwf);
    updateValueByLabel("ESIC Status", emp.statutoryDetails.esicStatus);
    updateValueByLabel("ESIC IP Number", emp.statutoryDetails.esicIp);

    updateValueByLabel("Bank Name", emp.bankDetails.bankName || "-");
    updateValueByLabel("Account Number", emp.bankDetails.accountNumber || "-");
    updateValueByLabel("IFSC Code", emp.bankDetails.ifsc || "-");

    // Populate Payroll Tab (Using IDs)
    setText("pay_basic", formatCurrency(emp.payroll.basic));
    setText("pay_hra", formatCurrency(emp.payroll.hra));
    setText("pay_da", formatCurrency(emp.payroll.da));
    setText("pay_gross", formatCurrency(emp.payroll.gross));
    setText("pay_pf", formatCurrency(emp.payroll.pf));
    setText("pay_tax", formatCurrency(emp.payroll.tax));
    setText("pay_ded", formatCurrency(emp.payroll.deductions));
    setText("pay_net", formatCurrency(emp.payroll.net));
  }

  function updateValueByLabel(labelText, valueText) {
    const wanted = (labelText || "").trim().toLowerCase();
    const boxes = document.querySelectorAll(".data-box");
    for (const box of boxes) {
      const lab = box.querySelector("label");
      const val = box.querySelector(".value");
      if (!lab || !val) continue;
      const got = (lab.textContent || "").trim().toLowerCase();
      if (got === wanted) {
        val.textContent = valueText;
        return true;
      }
    }
    return false;
  }

  function updateStatusBadge(status) {
    const statusEl = document.getElementById("p_status");
    if (!statusEl) return;
    statusEl.innerText = status || "-";
    statusEl.className = "status-badge";
    const s = (status || "").toLowerCase();
    if (s === "active") {
      statusEl.style.backgroundColor = "#d1fae5";
      statusEl.style.color = "#065f46";
    } else if (s === "on leave") {
      statusEl.style.backgroundColor = "#fff7ed";
      statusEl.style.color = "#c2410c";
    } else if (s === "dismissed" || s === "terminated") {
      statusEl.style.backgroundColor = "#fee2e2";
      statusEl.style.color = "#991b1b";
    } else {
      statusEl.style.backgroundColor = "#f3f4f6";
      statusEl.style.color = "#4b5563";
    }
  }

  function ensureSalaryHoldBadge() {
    const salaryEl = document.getElementById("p_salary");
    if (!salaryEl) return null;
    const box = salaryEl.closest(".data-box") || salaryEl.parentElement;
    if (!box) return null;
    let badge = box.querySelector("#admSalaryHoldBadge");
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "admSalaryHoldBadge";
      badge.innerText = "HOLD";
      badge.style.cssText = `margin-left: 10px; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: .5px; background: #fff7ed; color: #c2410c; display: none; vertical-align: middle;`;
      salaryEl.insertAdjacentElement("afterend", badge);
    }
    return { box, badge };
  }

  // ==================================================
  // --- 3. TAB LOGIC ---
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
  // --- 4. ADMIN ACTIONS ---
  // ==================================================
  window.admOpenModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modalId === "admSalaryModal" && currentEmpData) {
      const actionText = document.getElementById("admSalaryActionText");
      if (actionText) {
        if (currentEmpData.isSalaryHeld) {
          actionText.innerText = "Resume";
          actionText.style.color = "#10b981";
        } else {
          actionText.innerText = "Hold";
          actionText.style.color = "#d97706";
        }
      }
    }
    if (modalId === "admLoginModal" && currentEmpData) {
      const actionText = document.getElementById("admLoginActionText");
      if (actionText) {
        actionText.innerText = currentEmpData.isLoginDisabled ? "Enable" : "Disable";
      }
    }
    if (modal) modal.classList.add("adm-show");
  };

  window.admCloseModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("adm-show");
  };

  window.admPerformAction = function (actionType) {
    if (!currentEmpData) return;
    let modalId = "";
    switch (actionType) {
      case "salary":
        currentEmpData.isSalaryHeld = !currentEmpData.isSalaryHeld;
        modalId = "admSalaryModal";
        break;
      case "login":
        currentEmpData.isLoginDisabled = !currentEmpData.isLoginDisabled;
        modalId = "admLoginModal";
        break;
      case "dismiss":
        currentEmpData.status = "Dismissed";
        modalId = "admDismissModal";
        break;
      case "delete":
        admDeleteEmployeePermanently();
        return;
    }
    admSaveAndRefresh(currentEmpData, originalEmpId);
    if (modalId) admCloseModal(modalId);
  };

  function admUpdateUIState() {
    if (!currentEmpData) return;
    const salaryBtnText = document.getElementById("admTxtSalary");
    const salaryUI = ensureSalaryHoldBadge();
    if (currentEmpData.isSalaryHeld) {
      if (salaryBtnText) salaryBtnText.innerText = "Resume Salary";
      if (salaryUI?.box) salaryUI.box.classList.add("adm-salary-held");
      if (salaryUI?.badge) salaryUI.badge.style.display = "inline-block";
    } else {
      if (salaryBtnText) salaryBtnText.innerText = "Hold Salary";
      if (salaryUI?.box) salaryUI.box.classList.remove("adm-salary-held");
      if (salaryUI?.badge) salaryUI.badge.style.display = "none";
    }
    const loginBtnText = document.getElementById("admTxtLogin");
    if (currentEmpData.isLoginDisabled) {
      if (loginBtnText) loginBtnText.innerText = "Enable Login";
    } else {
      if (loginBtnText) loginBtnText.innerText = "Disable Login";
    }
    updateStatusBadge(currentEmpData.status);
  }

  function admSaveAndRefresh(updatedEmp, oldId = null) {
    updatedEmp = normalizeEmployee(updatedEmp);
    localStorage.setItem("viewEmployeeData", JSON.stringify(updatedEmp));
    const allEmps = JSON.parse(localStorage.getItem("employees")) || [];
    const searchId = oldId || updatedEmp.id;
    const index = allEmps.findIndex((e) => e.id === searchId);
    if (index !== -1) {
      allEmps[index] = updatedEmp;
    } else {
      allEmps.push(updatedEmp);
    }
    localStorage.setItem("employees", JSON.stringify(allEmps));
    originalEmpId = updatedEmp.id;
    admUpdateUIState();
  }

  function admDeleteEmployeePermanently() {
    const allEmps = JSON.parse(localStorage.getItem("employees")) || [];
    const newEmps = allEmps.filter((e) => e.id !== currentEmpData.id);
    localStorage.setItem("employees", JSON.stringify(newEmps));
    localStorage.removeItem("viewEmployeeData");
    alert("Employee Deleted Permanently.");
    window.history.back();
  }






// function fetchDocuments() {

// fetch(`http://13.60.70.185:8000/api/employee-documents/${emp_id}/`)
// .then(res => res.json())
// .then(data => {
// console.log(data)
// const docsGrid = document.getElementById("documentsGrid");
// docsGrid.innerHTML = "";

// if(!data.documents || data.documents.length === 0){
// docsGrid.innerHTML = "<p>No documents uploaded</p>";
// return;
// }

// data.documents.forEach(doc => {

// const fileUrl = `http://13.60.70.185/${doc.file}`;

// const card = `
// <div class="doc-card">
// <div class="doc-header">
// <i class="fa-regular fa-file-pdf doc-icon"></i>
// <span class="file-size">PDF</span>
// </div>

// <div class="doc-info">
// <h4>
// <a href="${fileUrl}" target="_blank">
// ${doc.description}
// </a>
// </h4>

// <p class="doc-type">${doc.doc_type}</p>
// <p class="upload-date">Uploaded: ${doc.uploaded_at}</p>
// </div>

// </div>
// `;

// docsGrid.innerHTML += card;

// });

// });
// }
const leave_table = document.getElementById('leavebody')
fetch(`http://13.51.167.95:8000/api/employee/apply-leave/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            leave_table.innerHTML = "";
            console.log(data)
            if (!data || data.length === 0) {
                leave_table.innerHTML = `<tr><td colspan="4">No leaves found</td></tr>`;
                return;
            }

            data.forEach(p => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${p.leave_type}</td>
                    <td>${p.from_date}</td>
                    <td>${p.to_date}</td>
                    <td>${p.number_of_days}</td>
                    <td>${p.status}</td>
                `;
                leave_table.appendChild(row);
            });
        })


function fetchDocuments() {

fetch(`http://13.51.167.95:8000/api/employee-documents/${emp_id}/`)
.then(res => res.json())
.then(data => {

console.log("API Response:", data);



const docsGrid = document.getElementById("documentsGrid");
docsGrid.innerHTML = "";

if(!data || data.length === 0){
docsGrid.innerHTML = "<p>No documents uploaded</p>";
return;
}

data.forEach(doc => {

const fileUrl = `http://13.51.167.95${doc.file}`;

const card = `
<div class="doc-card">
<div class="doc-header">
<i class="fa-regular fa-file-pdf doc-icon"></i>
<span class="file-size">PDF</span>
</div>

<div class="doc-info">
<h4>
<a href="${fileUrl}" target="_blank">
${doc.description}
</a>
</h4>

<p class="doc-type">${doc.doc_type}</p>
<p class="upload-date">Uploaded: ${doc.uploaded_at}</p>
</div>
</div>
`;

docsGrid.innerHTML += card;

});

})
.catch(err => console.error("Error:", err));
}



fetchDocuments();
  // ==================================================
  // --- 5. EDIT PROFILE MODAL ---
  // ==================================================
  function bindEditProfileButtons() {
    const downloadOrEditBtn = document.getElementById("downloadProfileBtn");
    const editBtn = document.getElementById("editProfileBtn");
    const candidates = [downloadOrEditBtn, editBtn].filter(Boolean);
    candidates.forEach((btn) => {
      if (!looksLikeEditButton(btn)) return;
      if (btn.dataset.editBound === "1") return;
      btn.dataset.editBound = "1";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        window.admOpenEditModal();
      });
    });
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
        <div><div style="font-size:18px;font-weight:900;">Edit Employee Profile</div><div style="color:#6b7280;font-size:13px;margin-top:2px;">Update details.</div></div>
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
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Email</label><input id="edit_email" type="email" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Phone</label><input id="edit_phone" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Location</label><input id="edit_location" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Marital Status</label><select id="edit_marital" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"><option value="Single">Single</option><option value="Married">Married</option><option value="Unmarried">Unmarried</option><option value="Divorced">Divorced</option></select></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Join Date</label><input id="edit_joinDate" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Salary</label><input id="edit_salary" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Status</label><select id="edit_status" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"><option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Dismissed">Dismissed</option><option value="Terminated">Terminated</option></select></div>
        </div>
        <div style="height:1px;background:#eef2f7;margin:16px 0;"></div>
        <div style="font-weight:900;color:#111827;margin:0 0 10px 0;">Statutory Information</div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
            <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">PAN</label><input id="edit_stat_pan" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
            <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">UAN</label><input id="edit_stat_uan" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
            <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Prof. Tax</label><input id="edit_stat_pt" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
            <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">LWF Status</label><input id="edit_stat_lwf" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
            <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">ESIC Status</label><input id="edit_stat_esic_status" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
            <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">ESIC IP</label><input id="edit_stat_esic_ip" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
        </div>
        <div style="height:1px;background:#eef2f7;margin:16px 0;"></div>
        <div style="font-weight:900;color:#111827;margin:0 0 10px 0;">Leave Balance (days)</div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Sick</label><input id="edit_leave_sick" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Casual</label><input id="edit_leave_casual" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Privilege</label><input id="edit_leave_privilege" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Maternity</label><input id="edit_leave_maternity" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Comp Off</label><input id="edit_leave_comp" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
        </div>
        <div style="height:1px;background:#eef2f7;margin:16px 0;"></div>
        <div style="font-weight:900;color:#111827;margin:0 0 10px 0;">Bank Details</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Bank Name</label><input id="edit_bank_name" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Account Number</label><input id="edit_bank_account" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
          <div style="grid-column: 1 / -1;"><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">IFSC Code</label><input id="edit_bank_ifsc" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;text-transform:uppercase;" /></div>
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
    if (!currentEmpData) return;
    const overlay = document.getElementById("admEditModal");
    if (!overlay) return;
    currentEmpData = normalizeEmployee(currentEmpData);
    const $ = (id) => document.getElementById(id);
    $("edit_id").value = currentEmpData.id || "";
    $("edit_name").value = currentEmpData.name || "";
    $("edit_role").value = currentEmpData.role || "";
    $("edit_dept").value = currentEmpData.department || "";
    $("edit_email").value = currentEmpData.email || "";
    $("edit_phone").value = currentEmpData.other_details[0].mobile || "";
    $("edit_location").value = currentEmpData.location || "";
    $("edit_marital").value = currentEmpData.maritalStatus || "Single";
    $("edit_joinDate").value = currentEmpData.joining || "";
    $("edit_salary").value = currentEmpData.salary || "";
    $("edit_status").value = currentEmpData.status || "Active";
    $("edit_stat_pan").value = currentEmpData.statutoryDetails.pan || "";
    $("edit_stat_uan").value = currentEmpData.statutoryDetails.uan || "";
    $("edit_stat_pt").value = currentEmpData.statutoryDetails.pt || "";
    $("edit_stat_lwf").value = currentEmpData.statutoryDetails.lwf || "";
    $("edit_stat_esic_status").value = currentEmpData.statutoryDetails.esicStatus || "";
    $("edit_stat_esic_ip").value = currentEmpData.statutoryDetails.esicIp || "";
    $("edit_leave_sick").value = currentEmpData.leaveBalance.sick;
    $("edit_leave_casual").value = currentEmpData.leaveBalance.casual;
    $("edit_leave_privilege").value = currentEmpData.leaveBalance.privilege;
    $("edit_leave_maternity").value = currentEmpData.leaveBalance.maternity;
    $("edit_leave_comp").value = currentEmpData.leaveBalance.compOff;
    $("edit_bank_name").value = currentEmpData.bankDetails.bankName || "";
    $("edit_bank_account").value = currentEmpData.bankDetails.accountNumber || "";
    $("edit_bank_ifsc").value = currentEmpData.bankDetails.ifsc || "";
    overlay.classList.add("adm-show");
  };

  window.admCloseEditModal = function () {
    const overlay = document.getElementById("admEditModal");
    if (overlay) overlay.classList.remove("adm-show");
  };

  window.admSaveEditEmployee = function () {
    if (!currentEmpData) return;
    const getVal = (id) => (document.getElementById(id)?.value ?? "").trim();
    const getNum = (id) => toIntOrDefault(getVal(id), 0);
    const name = getVal("edit_name");
    const newId = getVal("edit_id");
    if (!name || !newId) {
      alert("Name and Employee ID are required.");
      return;
    }
    currentEmpData = normalizeEmployee(currentEmpData);
    currentEmpData.id = newId;
    currentEmpData.name = name;
    currentEmpData.role = getVal("edit_role");
    currentEmpData.dept = getVal("edit_dept");
    currentEmpData.email = getVal("edit_email");
    currentEmpData.phone = getVal("edit_phone");
    currentEmpData.location = getVal("edit_location");
    currentEmpData.maritalStatus = getVal("edit_marital") || "Single";
    currentEmpData.joinDate = getVal("edit_joinDate");
    currentEmpData.salary = getVal("edit_salary");
    currentEmpData.status = getVal("edit_status") || currentEmpData.status;
    currentEmpData.statutoryDetails.pan = getVal("edit_stat_pan");
    currentEmpData.statutoryDetails.uan = getVal("edit_stat_uan");
    currentEmpData.statutoryDetails.pt = getVal("edit_stat_pt");
    currentEmpData.statutoryDetails.lwf = getVal("edit_stat_lwf");
    currentEmpData.statutoryDetails.esicStatus = getVal("edit_stat_esic_status");
    currentEmpData.statutoryDetails.esicIp = getVal("edit_stat_esic_ip");
    currentEmpData.leaveBalance.sick = getNum("edit_leave_sick");
    currentEmpData.leaveBalance.casual = getNum("edit_leave_casual");
    currentEmpData.leaveBalance.privilege = getNum("edit_leave_privilege");
    currentEmpData.leaveBalance.maternity = getNum("edit_leave_maternity");
    currentEmpData.leaveBalance.compOff = getNum("edit_leave_comp");
    currentEmpData.bankDetails.bankName = getVal("edit_bank_name");
    currentEmpData.bankDetails.accountNumber = getVal("edit_bank_account");
    currentEmpData.bankDetails.ifsc = getVal("edit_bank_ifsc").toUpperCase();
    admSaveAndRefresh(currentEmpData, originalEmpId);
    populateUI(currentEmpData);
    window.admCloseEditModal();
    showSuccessPopup("Profile updated successfully!");
  };

  // ==================================================
  // --- 6. PAYROLL MODAL (NEW) ---
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
           <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">HRA</label><input id="pay_in_hra" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
           <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">DA</label><input id="pay_in_da" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
           <div style="grid-column: 1 / -1;"><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Gross Salary</label><input id="pay_in_gross" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;background:#f3f4f6;" /></div>
           <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">PF</label><input id="pay_in_pf" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
           <div><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Tax</label><input id="pay_in_tax" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
           <div style="grid-column: 1 / -1;"><label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Other Deductions</label><input id="pay_in_ded" type="number" step="0.01" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" /></div>
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

    // Make .adm-show work
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
    if (!currentEmpData) return;
    const overlay = document.getElementById("admPayrollModal");
    if (!overlay) return;

    currentEmpData = normalizeEmployee(currentEmpData);
    const p = currentEmpData.payroll;

    document.getElementById("pay_in_basic").value = p.basic;
    document.getElementById("pay_in_hra").value = p.hra;
    document.getElementById("pay_in_da").value = p.da;
    document.getElementById("pay_in_gross").value = p.gross;
    document.getElementById("pay_in_pf").value = p.pf;
    document.getElementById("pay_in_tax").value = p.tax;
    document.getElementById("pay_in_ded").value = p.deductions;
    document.getElementById("pay_in_net").value = p.net;

    overlay.classList.add("adm-show");
  };

  window.admClosePayrollModal = function () {
    const overlay = document.getElementById("admPayrollModal");
    if (overlay) overlay.classList.remove("adm-show");
  };

  window.admSavePayroll = function () {
    if (!currentEmpData) return;

    const getNum = (id) => toIntOrDefault(document.getElementById(id).value, 0);

    // Update data
    currentEmpData.payroll.basic = getNum("pay_in_basic");
    currentEmpData.payroll.hra = getNum("pay_in_hra");
    currentEmpData.payroll.da = getNum("pay_in_da");
    currentEmpData.payroll.gross = getNum("pay_in_gross");
    currentEmpData.payroll.pf = getNum("pay_in_pf");
    currentEmpData.payroll.tax = getNum("pay_in_tax");
    currentEmpData.payroll.deductions = getNum("pay_in_ded");
    currentEmpData.payroll.net = getNum("pay_in_net");

    // Save
    admSaveAndRefresh(currentEmpData, originalEmpId);
    populateUI(currentEmpData);

    window.admClosePayrollModal();
    showSuccessPopup("Salary history updated successfully!");
  };

  // ==================================================
  // --- 7. SUCCESS POPUP ---
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
  // --- 8. DOWNLOAD LOGIC ---
  // ==================================================
  const downloadModal = document.getElementById("downloadModal");
  function bindDownloadButtonIfPresent() {
    const downloadBtn = document.getElementById("downloadProfileBtn");
    if (!downloadBtn) return;
    if (looksLikeEditButton(downloadBtn)) return;
    if (downloadBtn.dataset.downloadBound === "1") return;
    downloadBtn.dataset.downloadBound = "1";
    downloadBtn.addEventListener("click", function () {
      if (!currentEmpData) {
        alert("No employee data available.");
        return;
      }
      if (downloadModal) downloadModal.classList.add("active");
    });
  }

  window.closeDownloadModal = function () {
    if (downloadModal) downloadModal.classList.remove("active");
  };

  window.downloadAsCSV = function () {
    if (!currentEmpData) return;
    currentEmpData = normalizeEmployee(currentEmpData);
    const emp = currentEmpData;
    const headers = ["ID", "Name", "Role", "Department", "Email", "Phone", "Location", "Marital Status", "Join Date", "Salary", "Status", "Salary Held", "Login Disabled", "Sick Leave", "Casual Leave", "Privilege Leave", "Maternity Leave", "Comp Off", "PAN", "UAN", "Prof Tax", "LWF", "ESIC Status", "ESIC IP", "Bank Name", "Account Number", "IFSC Code", "Basic Pay", "HRA", "DA", "Gross", "PF", "Tax", "Deductions", "Net Pay"];
    const values = [
      emp.id, emp.name, emp.role, emp.dept, emp.email, emp.phone, emp.location, emp.maritalStatus || "Single", emp.joinDate, emp.salary, emp.status, emp.isSalaryHeld ? "Yes" : "No", emp.isLoginDisabled ? "Yes" : "No",
      emp.leaveBalance.sick, emp.leaveBalance.casual, emp.leaveBalance.privilege, emp.leaveBalance.maternity, emp.leaveBalance.compOff,
      emp.statutoryDetails.pan, emp.statutoryDetails.uan, emp.statutoryDetails.pt, emp.statutoryDetails.lwf, emp.statutoryDetails.esicStatus, emp.statutoryDetails.esicIp,
      emp.bankDetails.bankName, emp.bankDetails.accountNumber, emp.bankDetails.ifsc,
      emp.payroll.basic, emp.payroll.hra, emp.payroll.da, emp.payroll.gross, emp.payroll.pf, emp.payroll.tax, emp.payroll.deductions, emp.payroll.net
    ];
    const csvEscape = (v) => {
      const s = (v ?? "").toString();
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const csvContent = headers.map(csvEscape).join(",") + "\n" + values.map(csvEscape).join(",");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(emp.name || "Employee").replace(/\s+/g, "_")}_Profile.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.closeDownloadModal();
  };

  window.downloadAsPDF = function () {
    if (!currentEmpData) return;
    window.closeDownloadModal();
    const element = document.querySelector(".main-container");
    const controls = document.querySelectorAll(".top-nav, .header-actions, .tabs-container, .adm-actions-grid");
    controls.forEach((el) => (el.style.display = "none"));
    const opt = {
      margin: 0.3,
      filename: `${(currentEmpData.name || "Employee").replace(/\s+/g, "_")}_Profile.pdf`,
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