document.addEventListener("DOMContentLoaded", function () {
  // --- 1. Tab Switching Logic ---
  window.switchTab = function (tabName) {
    // Handle Tabs Styling
    const allTabs = document.querySelectorAll(".tab-item");
    allTabs.forEach((tab) => tab.classList.remove("active"));
    event.currentTarget.classList.add("active");

    // Handle Content Visibility
    const allContent = document.querySelectorAll(".tab-content");
    allContent.forEach((content) => (content.style.display = "none"));

    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
      selectedContent.style.display = "block";
    }
  };

  // --- 2. Populate Data from LocalStorage ---
  const storedData = localStorage.getItem("viewEmployeeData");

  if (storedData) {
    const emp = JSON.parse(storedData);

    // Helper function to safely update text elements
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text || "-";
    };

    // --- Header Populate ---
    setText("p_name", emp.name);
    setText("p_role", emp.role);
    setText("p_dept", emp.dept);

    // Generate Initials
    const initials = emp.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    setText("p_initials", initials);

    // --- Overview Tab Populate ---
    setText("p_id", emp.id);
    setText("p_join", emp.joinDate);
    setText("p_salary", emp.salary);

    setText("p_email", emp.email);
    setText("p_phone", emp.phone);
    setText("p_location", emp.location);

    setText("p_dept_2", emp.dept);
    setText("p_role_2", emp.role);

    // Handle Status Badge Color
    const statusEl = document.getElementById("p_status");
    if (statusEl) {
      statusEl.innerText = emp.status;
      statusEl.className = "status-badge"; // Reset class

      if (emp.status === "Active") {
        statusEl.style.backgroundColor = "#d1fae5";
        statusEl.style.color = "#065f46";
      } else if (emp.status === "On Leave") {
        statusEl.style.backgroundColor = "#fff7ed";
        statusEl.style.color = "#c2410c";
      } else {
        statusEl.style.backgroundColor = "#f3f4f6";
        statusEl.style.color = "#4b5563";
      }
    }
  } else {
    console.log(
      "No employee data found. Please select an employee from the list.",
    );
    // window.location.href = "employee.html";
  }
});
