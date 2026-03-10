document.addEventListener("DOMContentLoaded", function () {
  // --- Global Variable ---
  let currentEmpData = null;

  // ==================================================
  // --- 1. INITIALIZATION & DATA POPULATION ---
  // ==================================================
  const storedData = localStorage.getItem("viewEmployeeData");
  if (storedData) {
    currentEmpData = JSON.parse(storedData);
    populateUI(currentEmpData);     // Fill text fields
    admUpdateUIState();             // Set initial state (Salary Hold badge + buttons)
  } else {
    alert("No employee selected.");
    window.history.back();
    return;
  }

  // Helper: Populate Standard Text Fields
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

    // Status Badge
    updateStatusBadge(emp.status);
  }

  // Helper: Update Status Badge Colors
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
  // --- Salary HOLD badge (shows when held, hides when resumed) ---
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
  // --- 2. TAB SWITCHING LOGIC ---
  // ==================================================
  window.switchTab = function (tabName, evt) {
    const e = evt || window.event; // support inline onclick
    const allTabs = document.querySelectorAll(".tab-item");
    allTabs.forEach((tab) => tab.classList.remove("active"));
    if (e && e.currentTarget) e.currentTarget.classList.add("active");

    const allContent = document.querySelectorAll(".tab-content");
    allContent.forEach((content) => (content.style.display = "none"));

    const selectedContent = document.getElementById(tabName);
    if (selectedContent) selectedContent.style.display = "block";
  };

  // ==================================================
  // --- 3. ADMIN ACTIONS (Salary, Login, Dismiss, Delete) ---
  // ==================================================
  // A. Open Admin Modal (With Dynamic Text Logic)
  window.admOpenModal = function (modalId) {
    const modal = document.getElementById(modalId);

    // Salary modal text
    if (modalId === "admSalaryModal" && currentEmpData) {
      const actionText = document.getElementById("admSalaryActionText");
      if (actionText) {
        if (currentEmpData.isSalaryHeld) {
          actionText.innerText = "Resume";
          actionText.style.color = "#10b981"; // Green
        } else {
          actionText.innerText = "Hold";
          actionText.style.color = "#d97706"; // Orange
        }
      }
    }

    // Login modal text
    if (modalId === "admLoginModal" && currentEmpData) {
      const actionText = document.getElementById("admLoginActionText");
      if (actionText) {
        actionText.innerText = currentEmpData.isLoginDisabled ? "Enable" : "Disable";
      }
    }

    if (modal) modal.classList.add("adm-show");
  };

  // B. Close Admin Modal
  window.admCloseModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("adm-show");
  };

  // C. Perform Action (Toggle State)
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
        return; // stop
    }

    admSaveAndRefresh(currentEmpData);
    if (modalId) admCloseModal(modalId);
  };

  // D. Update UI Buttons & Visuals based on Data (UPDATED FOR HOLD TEXT)
  function admUpdateUIState() {
    if (!currentEmpData) return;

    // --- SALARY LOGIC ---
    const salaryBtnText = document.getElementById("admTxtSalary");
    const salaryUI = ensureSalaryHoldBadge(); // { box, badge }

    if (currentEmpData.isSalaryHeld) {
      if (salaryBtnText) salaryBtnText.innerText = "Resume Salary";
      if (salaryUI?.box) salaryUI.box.classList.add("adm-salary-held");
      if (salaryUI?.badge) salaryUI.badge.style.display = "inline-block"; // HOLD text ON
    } else {
      if (salaryBtnText) salaryBtnText.innerText = "Hold Salary";
      if (salaryUI?.box) salaryUI.box.classList.remove("adm-salary-held");
      if (salaryUI?.badge) salaryUI.badge.style.display = "none"; // HOLD text OFF
    }

    // --- LOGIN LOGIC ---
    const loginBtnText = document.getElementById("admTxtLogin");
    if (currentEmpData.isLoginDisabled) {
      if (loginBtnText) loginBtnText.innerText = "Enable Login";
    } else {
      if (loginBtnText) loginBtnText.innerText = "Disable Login";
    }

    // --- STATUS BADGE ---
    updateStatusBadge(currentEmpData.status);
  }

  // E. Save Data Helper
  function admSaveAndRefresh(updatedEmp) {
    // 1) Update Current View
    localStorage.setItem("viewEmployeeData", JSON.stringify(updatedEmp));

    // 2) Update Main Database (List of all employees)
    const allEmps = JSON.parse(localStorage.getItem("employees")) || [];
    const index = allEmps.findIndex((e) => e.id === updatedEmp.id);
    if (index !== -1) {
      allEmps[index] = updatedEmp;
      localStorage.setItem("employees", JSON.stringify(allEmps));
    }

    // 3) Refresh UI
    admUpdateUIState();
  }

  // F. Delete Employee Logic
  function admDeleteEmployeePermanently() {
    const allEmps = JSON.parse(localStorage.getItem("employees")) || [];
    const newEmps = allEmps.filter((e) => e.id !== currentEmpData.id);

    localStorage.setItem("employees", JSON.stringify(newEmps));
    localStorage.removeItem("viewEmployeeData");

    alert("Employee Deleted Permanently.");
    window.history.back();
  }

  // ==================================================
  // --- 4. DOWNLOAD LOGIC (CSV & PDF) ---
  // ==================================================
  const downloadBtn = document.getElementById("downloadProfileBtn");
  const downloadModal = document.getElementById("downloadModal");

  // Open Download Modal
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      if (!currentEmpData) {
        alert("No employee data available.");
        return;
      }
      if (downloadModal) downloadModal.classList.add("active");
    });
  }

  // Close Download Modal
  window.closeDownloadModal = function () {
    if (downloadModal) downloadModal.classList.remove("active");
  };

  // CSV Download (fixed template literals + safe CSV quoting)
  window.downloadAsCSV = function () {
    if (!currentEmpData) return;

    const emp = currentEmpData;
    const headers = [
      "ID",
      "Name",
      "Role",
      "Department",
      "Email",
      "Phone",
      "Location",
      "Marital Status",
      "Join Date",
      "Salary",
      "Status",
      "Salary Held",
      "Login Disabled",
    ];

    const values = [
      emp.id,
      emp.name,
      emp.role,
      emp.dept,
      emp.email,
      emp.phone,
      emp.location,
      emp.maritalStatus || "Single",
      emp.joinDate,
      emp.salary,
      emp.status,
      emp.isSalaryHeld ? "Yes" : "No",
      emp.isLoginDisabled ? "Yes" : "No",
    ];

    const csvEscape = (v) => {
      const s = (v ?? "").toString();
      // Quote if it contains comma, quote, or newline
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const csvContent =
      headers.map(csvEscape).join(",") + "\n" + values.map(csvEscape).join(",");

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

  // PDF Download (fixed template literals)
  window.downloadAsPDF = function () {
    if (!currentEmpData) return;

    window.closeDownloadModal();

    const element = document.querySelector(".main-container");

    // Hide UI controls before printing so they don't appear in PDF
    const controls = document.querySelectorAll(
      ".top-nav, .header-actions, .tabs-container, .adm-actions-grid"
    );
    controls.forEach((el) => (el.style.display = "none"));

    const opt = {
      margin: 0.3,
      filename: `${(currentEmpData.name || "Employee").replace(/\s+/g, "_")}_Profile.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    if (typeof html2pdf !== "undefined") {
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          controls.forEach((el) => (el.style.display = ""));
        })
        .catch(() => {
          controls.forEach((el) => (el.style.display = ""));
        });
    } else {
      alert("PDF Library not loaded. Please include html2pdf.js");
      controls.forEach((el) => (el.style.display = ""));
    }
  };

  // ==================================================
  // --- 5. GLOBAL CLICK HANDLER (Close All Modals) ---
  // ==================================================
  window.onclick = function (event) {
    // Close Admin Modals
    if (event.target && event.target.classList && event.target.classList.contains("adm-modal-overlay")) {
      event.target.classList.remove("adm-show");
    }

    // Close Download Modal
    if (event.target === downloadModal) {
      window.closeDownloadModal();
    }
  };
});