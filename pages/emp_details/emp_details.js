document.addEventListener("DOMContentLoaded", function () {
  let currentEmpData = null;
  // We keep track of the original ID in case the user changes it in the edit form
  let originalEmpId = null;

  // ==================================================
  // --- 1. INITIALIZATION & DATA NORMALIZATION ---
  // ==================================================
  const storedData = localStorage.getItem("viewEmployeeData");

  if (storedData) {
    currentEmpData = normalizeEmployee(JSON.parse(storedData));
    originalEmpId = currentEmpData.id; // Store original ID for tracking updates
    
    // re-save normalized version
    localStorage.setItem("viewEmployeeData", JSON.stringify(currentEmpData));

    populateUI(currentEmpData);
    admUpdateUIState();
  } else {
    alert("No employee selected.");
    window.history.back();
    return;
  }

  // Inject modals/popups (once)
  injectEditModal();
  injectSuccessPopup();

  // Bind buttons
  bindEditProfileButtons();
  bindDownloadButtonIfPresent();

  function normalizeEmployee(emp) {
    const e = emp || {};

    // Basic defaults
    e.id = e.id || "EMP-000";
    e.name = e.name || "Unknown";

    // Leave Balance defaults (days)
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

    // Statutory Information Defaults (NEW)
    if (!e.statutoryDetails || typeof e.statutoryDetails !== "object") e.statutoryDetails = {};
    e.statutoryDetails.pan = (e.statutoryDetails.pan ?? "-NA-").toString();
    e.statutoryDetails.uan = (e.statutoryDetails.uan ?? "-NA-").toString();
    e.statutoryDetails.pt = (e.statutoryDetails.pt ?? "-NA-").toString();
    e.statutoryDetails.lwf = (e.statutoryDetails.lwf ?? "-NA-").toString();
    e.statutoryDetails.esicStatus = (e.statutoryDetails.esicStatus ?? "-NA-").toString();
    e.statutoryDetails.esicIp = (e.statutoryDetails.esicIp ?? "-NA-").toString();

    // Admin flags defaults
    e.isSalaryHeld = !!e.isSalaryHeld;
    e.isLoginDisabled = !!e.isLoginDisabled;

    // Status default
    e.status = e.status || "Active";

    return e;
  }

  function toIntOrDefault(v, def) {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
  }

  // ==================================================
  // --- 2. UI POPULATION ---
  // ==================================================
  function populateUI(emp) {
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text || "-";
    };

    // Header
    setText("p_name", emp.name);
    setText("p_role", emp.role);
    setText("p_dept", emp.dept);
    setText(
      "p_initials",
      emp.name
        ? emp.name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "NA"
    );

    // Overview Tab
    setText("p_id", emp.id);
    setText("p_join", emp.joinDate);
    setText("p_salary", emp.salary);
    setText("p_email", emp.email);
    setText("p_phone", emp.phone);
    setText("p_location", emp.location);

    // Details
    setText("p_dept_2", emp.dept);
    setText("p_role_2", emp.role);
    setText("p_marital", emp.maritalStatus || "Single");

    // Status badge
    updateStatusBadge(emp.status);

    // Leave Balance
    updateValueByLabel("Sick Leave", `${emp.leaveBalance.sick} days`);
    updateValueByLabel("Casual Leave", `${emp.leaveBalance.casual} days`);
    updateValueByLabel("Privilege Leave", `${emp.leaveBalance.privilege} days`);
    updateValueByLabel("Maternity Leave", `${emp.leaveBalance.maternity} days`);
    updateValueByLabel("Comp Off", `${emp.leaveBalance.compOff} days`);

    // Statutory Info (NEW)
    updateValueByLabel("PAN", emp.statutoryDetails.pan);
    updateValueByLabel("PAN UAN", emp.statutoryDetails.uan);
    updateValueByLabel("Professional Tax", emp.statutoryDetails.pt);
    updateValueByLabel("LWF Status", emp.statutoryDetails.lwf);
    updateValueByLabel("ESIC Status", emp.statutoryDetails.esicStatus);
    updateValueByLabel("ESIC IP Number", emp.statutoryDetails.esicIp);

    // Bank Details
    updateValueByLabel("Bank Name", emp.bankDetails.bankName || "-");
    updateValueByLabel("Account Number", emp.bankDetails.accountNumber || "-");
    updateValueByLabel("IFSC Code", emp.bankDetails.ifsc || "-");
  }

  // Update a .data-box value by its <label> text (case-insensitive)
  function updateValueByLabel(labelText, valueText) {
    const wanted = (labelText || "").trim().toLowerCase();
    const boxes = document.querySelectorAll(".data-box");
    for (const box of boxes) {
      const lab = box.querySelector("label");
      const val = box.querySelector(".value");
      if (!lab || !val) continue;
      const got = (lab.textContent || "").trim().toLowerCase();
      // Simple includes check or exact match
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

  // ==================================================
  // --- Salary HOLD badge ---
  // ==================================================
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
      badge.style.cssText = `
        margin-left: 10px;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .5px;
        background: #fff7ed;
        color: #c2410c;
        display: none;
        vertical-align: middle;
      `;
      salaryEl.insertAdjacentElement("afterend", badge);
    }

    return { box, badge };
  }

  // ==================================================
  // --- 3. TAB SWITCHING LOGIC ---
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
  // --- 4. ADMIN ACTIONS (Salary, Login, Dismiss) ---
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

    // Salary state
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

    // Login state
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

    // Update view storage
    localStorage.setItem("viewEmployeeData", JSON.stringify(updatedEmp));

    // Update main array
    const allEmps = JSON.parse(localStorage.getItem("employees")) || [];
    
    // If oldId is provided, we search by that (in case ID was edited)
    // Otherwise search by current ID
    const searchId = oldId || updatedEmp.id;
    
    const index = allEmps.findIndex((e) => e.id === searchId);
    
    if (index !== -1) {
      allEmps[index] = updatedEmp;
    } else {
      allEmps.push(updatedEmp);
    }

    localStorage.setItem("employees", JSON.stringify(allEmps));
    
    // Update the tracker
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

  // ==================================================
  // --- 5. EDIT EMPLOYEE MODAL (Includes Statutory & Editable ID) ---
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
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,.45);
      display: none; align-items: center; justify-content: center;
      padding: 18px; z-index: 9999;
    `;

    const modal = document.createElement("div");
    modal.className = "adm-modal";
    modal.style.cssText = `
      width: min(920px, 100%); background: #fff; border-radius: 18px;
      padding: 18px; box-shadow: 0 18px 45px rgba(0,0,0,.28);
      max-height: 85vh; overflow: auto; scrollbar-width: none;
      -ms-overflow-style: none; font-family: inherit;
    `;

    // Note: ID input is now editable (removed 'disabled' and background style)
    // Added Statutory Information Section
    modal.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div style="font-size:18px;font-weight:900;">Edit Employee Profile</div>
          <div style="color:#6b7280;font-size:13px;margin-top:2px;">Update details, statutory info, leave and bank details.</div>
        </div>
        <button type="button" id="admEditCloseX" style="border:none;background:#f3f4f6;border-radius:12px;padding:8px 10px;cursor:pointer;font-weight:900;">✕</button>
      </div>

      <div style="height:1px;background:#eef2f7;margin:14px 0;"></div>

      <form id="admEditForm">
        <div style="font-weight:900;color:#111827;margin:8px 0 10px 0;">Profile</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Employee ID</label>
            <input id="edit_id" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Name *</label>
            <input id="edit_name" type="text" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Role</label>
            <input id="edit_role" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Department</label>
            <input id="edit_dept" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Email</label>
            <input id="edit_email" type="email" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Phone</label>
            <input id="edit_phone" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Location</label>
            <input id="edit_location" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Marital Status</label>
            <select id="edit_marital" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Join Date</label>
            <input id="edit_joinDate" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Salary</label>
            <input id="edit_salary" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Status</label>
            <select id="edit_status" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Dismissed">Dismissed</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        <div style="height:1px;background:#eef2f7;margin:16px 0;"></div>
        
        <!-- STATUTORY INFO SECTION -->
        <div style="font-weight:900;color:#111827;margin:0 0 10px 0;">Statutory Information</div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
            <div>
                <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">PAN</label>
                <input id="edit_stat_pan" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            </div>
            <div>
                <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">UAN</label>
                <input id="edit_stat_uan" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            </div>
            <div>
                <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Prof. Tax</label>
                <input id="edit_stat_pt" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            </div>
            <div>
                <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">LWF Status</label>
                <input id="edit_stat_lwf" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            </div>
            <div>
                <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">ESIC Status</label>
                <input id="edit_stat_esic_status" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            </div>
             <div>
                <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">ESIC IP</label>
                <input id="edit_stat_esic_ip" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            </div>
        </div>

        <div style="height:1px;background:#eef2f7;margin:16px 0;"></div>

        <div style="font-weight:900;color:#111827;margin:0 0 10px 0;">Leave Balance (days)</div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Sick</label>
            <input id="edit_leave_sick" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Casual</label>
            <input id="edit_leave_casual" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Privilege</label>
            <input id="edit_leave_privilege" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Maternity</label>
            <input id="edit_leave_maternity" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Comp Off</label>
            <input id="edit_leave_comp" type="number" min="0" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
        </div>

        <div style="height:1px;background:#eef2f7;margin:16px 0;"></div>

        <div style="font-weight:900;color:#111827;margin:0 0 10px 0;">Bank Details</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Bank Name</label>
            <input id="edit_bank_name" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">Account Number</label>
            <input id="edit_bank_account" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
          </div>
          <div style="grid-column: 1 / -1;">
            <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">IFSC Code</label>
            <input id="edit_bank_ifsc" type="text" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:12px;text-transform:uppercase;" />
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
          <button type="button" id="admEditCancel" style="padding:10px 14px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-weight:800;">Cancel</button>
          <button type="submit" id="admEditSave" style="padding:10px 14px;border-radius:12px;border:none;background:linear-gradient(135deg,#111827,#334155);color:#fff;cursor:pointer;font-weight:900;">Save Changes</button>
        </div>
      </form>
    `;

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

    // Profile
    $("edit_id").value = currentEmpData.id || "";
    $("edit_name").value = currentEmpData.name || "";
    $("edit_role").value = currentEmpData.role || "";
    $("edit_dept").value = currentEmpData.dept || "";
    $("edit_email").value = currentEmpData.email || "";
    $("edit_phone").value = currentEmpData.phone || "";
    $("edit_location").value = currentEmpData.location || "";
    $("edit_marital").value = currentEmpData.maritalStatus || "Single";
    $("edit_joinDate").value = currentEmpData.joinDate || "";
    $("edit_salary").value = currentEmpData.salary || "";
    $("edit_status").value = currentEmpData.status || "Active";

    // Statutory (New)
    $("edit_stat_pan").value = currentEmpData.statutoryDetails.pan || "";
    $("edit_stat_uan").value = currentEmpData.statutoryDetails.uan || "";
    $("edit_stat_pt").value = currentEmpData.statutoryDetails.pt || "";
    $("edit_stat_lwf").value = currentEmpData.statutoryDetails.lwf || "";
    $("edit_stat_esic_status").value = currentEmpData.statutoryDetails.esicStatus || "";
    $("edit_stat_esic_ip").value = currentEmpData.statutoryDetails.esicIp || "";

    // Leave
    $("edit_leave_sick").value = currentEmpData.leaveBalance.sick;
    $("edit_leave_casual").value = currentEmpData.leaveBalance.casual;
    $("edit_leave_privilege").value = currentEmpData.leaveBalance.privilege;
    $("edit_leave_maternity").value = currentEmpData.leaveBalance.maternity;
    $("edit_leave_comp").value = currentEmpData.leaveBalance.compOff;

    // Bank
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

    // Profile
    currentEmpData.id = newId; // Update ID
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

    // Statutory (New)
    currentEmpData.statutoryDetails.pan = getVal("edit_stat_pan");
    currentEmpData.statutoryDetails.uan = getVal("edit_stat_uan");
    currentEmpData.statutoryDetails.pt = getVal("edit_stat_pt");
    currentEmpData.statutoryDetails.lwf = getVal("edit_stat_lwf");
    currentEmpData.statutoryDetails.esicStatus = getVal("edit_stat_esic_status");
    currentEmpData.statutoryDetails.esicIp = getVal("edit_stat_esic_ip");

    // Leave balance
    currentEmpData.leaveBalance.sick = getNum("edit_leave_sick");
    currentEmpData.leaveBalance.casual = getNum("edit_leave_casual");
    currentEmpData.leaveBalance.privilege = getNum("edit_leave_privilege");
    currentEmpData.leaveBalance.maternity = getNum("edit_leave_maternity");
    currentEmpData.leaveBalance.compOff = getNum("edit_leave_comp");

    // Bank details
    currentEmpData.bankDetails.bankName = getVal("edit_bank_name");
    currentEmpData.bankDetails.accountNumber = getVal("edit_bank_account");
    currentEmpData.bankDetails.ifsc = getVal("edit_bank_ifsc").toUpperCase();

    // Pass originalEmpId in case the ID was changed so we can find the old record
    admSaveAndRefresh(currentEmpData, originalEmpId);
    populateUI(currentEmpData);

    window.admCloseEditModal();
    showSuccessPopup("Profile updated successfully!");
  };

  // ==================================================
  // --- Success Popup ---
  // ==================================================
  function injectSuccessPopup() {
    if (document.getElementById("admSuccessPopup")) return;
    const el = document.createElement("div");
    el.id = "admSuccessPopup";
    el.style.cssText = `
      position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
      background: rgba(17,24,39,.35); z-index: 10000; padding: 16px;
    `;
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
            <div>
              <div id="admSuccessMsg" style="font-weight:900; color:#111827; font-size:14px; line-height:1.35;">Updated successfully</div>
              <div style="color:#6b7280; font-size:12px; margin-top:4px;">Changes have been saved.</div>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:14px;">
            <button id="admSuccessOk" type="button" style="border:none;background:#111827;color:#fff;padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:900;">OK</button>
          </div>
        </div>
      </div>
    `;
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
  // --- 6. DOWNLOAD LOGIC (CSV & PDF) ---
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
    const headers = [
      "ID", "Name", "Role", "Department", "Email", "Phone", "Location", "Marital Status", "Join Date", "Salary", "Status",
      "Salary Held", "Login Disabled",
      "Sick Leave", "Casual Leave", "Privilege Leave", "Maternity Leave", "Comp Off",
      "PAN", "UAN", "Prof Tax", "LWF", "ESIC Status", "ESIC IP",
      "Bank Name", "Account Number", "IFSC Code"
    ];
    const values = [
      emp.id, emp.name, emp.role, emp.dept, emp.email, emp.phone, emp.location, emp.maritalStatus || "Single", emp.joinDate, emp.salary, emp.status,
      emp.isSalaryHeld ? "Yes" : "No", emp.isLoginDisabled ? "Yes" : "No",
      emp.leaveBalance.sick, emp.leaveBalance.casual, emp.leaveBalance.privilege, emp.leaveBalance.maternity, emp.leaveBalance.compOff,
      emp.statutoryDetails.pan, emp.statutoryDetails.uan, emp.statutoryDetails.pt, emp.statutoryDetails.lwf, emp.statutoryDetails.esicStatus, emp.statutoryDetails.esicIp,
      emp.bankDetails.bankName, emp.bankDetails.accountNumber, emp.bankDetails.ifsc
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