document.addEventListener("DOMContentLoaded", function () {
  
  // --- Global Variable ---
  let currentEmpData = null;

  // --- 1. Tab Switching Logic ---
  window.switchTab = function (tabName) {
    const allTabs = document.querySelectorAll(".tab-item");
    allTabs.forEach((tab) => tab.classList.remove("active"));
    event.currentTarget.classList.add("active");

    const allContent = document.querySelectorAll(".tab-content");
    allContent.forEach((content) => (content.style.display = "none"));

    const selectedContent = document.getElementById(tabName);
    if (selectedContent) selectedContent.style.display = "block";
  };

  // --- 2. Populate Data from LocalStorage ---
  const storedData = localStorage.getItem("viewEmployeeData");

  if (storedData) {
    const emp = JSON.parse(storedData);
    currentEmpData = emp;

    // Helper to safely set text
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text || "-";
    };

    // --- Header & Basic Info ---
    setText("p_name", emp.name);
    setText("p_role", emp.role);
    setText("p_dept", emp.dept);
    setText("p_initials", emp.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase());

    // --- Overview Tab ---
    setText("p_id", emp.id);
    setText("p_join", emp.joinDate);
    setText("p_salary", emp.salary);
    setText("p_email", emp.email);
    setText("p_phone", emp.phone);
    setText("p_location", emp.location);
    
    // Personal Info
    // Note: If your data doesn't have maritalStatus, it defaults to 'Single'
    setText("p_marital", emp.maritalStatus || "Unmarried"); 

    // Employment Details
    setText("p_dept_2", emp.dept);
    setText("p_role_2", emp.role);

    // --- Employment Status Badge (Active/Leave) ---
    // Ensure this ID (p_status) exists in your Employment Details section, NOT Personal Info
    const statusEl = document.getElementById("p_status");
    if (statusEl) {
      statusEl.innerText = emp.status;
      statusEl.className = "status-badge"; 
      if (emp.status === "Active") {
        statusEl.style.backgroundColor = "#d1fae5"; statusEl.style.color = "#065f46";
      } else if (emp.status === "On Leave") {
        statusEl.style.backgroundColor = "#fff7ed"; statusEl.style.color = "#c2410c";
      } else {
        statusEl.style.backgroundColor = "#f3f4f6"; statusEl.style.color = "#4b5563";
      }
    }
  }

  // ==========================================
  // --- 3. MODAL & DOWNLOAD LOGIC ---
  // ==========================================

  const downloadBtn = document.getElementById("downloadProfileBtn");
  const downloadModal = document.getElementById("downloadModal");

  // A. Open Modal
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      if (!currentEmpData) {
        alert("No employee data available.");
        return;
      }
      // Add 'active' class to show modal (requires CSS .modal-overlay.active { display: flex; })
      downloadModal.classList.add("active");
    });
  }

  // B. Close Modal
  window.closeDownloadModal = function() {
    downloadModal.classList.remove("active");
  };

  // Close on outside click
  window.addEventListener("click", (e) => {
    if (e.target === downloadModal) {
      window.closeDownloadModal();
    }
  });

  // C. CSV Download Logic
  window.downloadAsCSV = function() {
    if(!currentEmpData) return;
    const emp = currentEmpData;

    // Added Marital Status to CSV
    const headers = [
      "ID", "Name", "Role", "Department", "Email", 
      "Phone", "Location", "Marital Status", "Join Date", "Salary", "Status"
    ];
    
    const values = [
        emp.id, 
        emp.name, 
        emp.role, 
        emp.dept, 
        emp.email, 
        emp.phone, 
        emp.location, 
        emp.maritalStatus || "Single", // Default value
        emp.joinDate, 
        emp.salary, 
        emp.status
    ];

    let csvContent = headers.join(",") + "\n" + values.map(v => `"${v || ''}"`).join(",");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = emp.name.replace(/\s+/g, '_');
    
    link.href = url;
    link.download = `${safeName}_Profile.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.closeDownloadModal();
  };

  // D. PDF Download Logic
  window.downloadAsPDF = function() {
    if(!currentEmpData) return;
    
    // 1. Close Modal FIRST
    window.closeDownloadModal();

    // 2. Select content
    const element = document.querySelector(".main-container"); 
    
    // 3. Hide Navigation elements for the print
    const controls = document.querySelectorAll(".top-nav, .header-actions, .tabs-container");
    controls.forEach(el => el.style.display = 'none');

    // 4. PDF Options
    const opt = {
        margin:       0.3,
        filename:     `${currentEmpData.name.replace(/\s+/g, '_')}_Profile.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // 5. Generate
    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save().then(() => {
            // 6. Restore Navigation after printing
            controls.forEach(el => el.style.display = '');
        });
    } else {
        alert("PDF Library not loaded.");
        controls.forEach(el => el.style.display = '');
    }
  };
});