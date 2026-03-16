
// --- PRELOADER LOGIC ---
window.addEventListener("load", function () {
    const preloader = document.getElementById("page-preloader");
    
    // Minimum wait time of 800ms for a smooth experience, 
    // even if the page loads instantly.
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add("loaded");
            
            // Optional: Remove it from DOM entirely after fade out ends
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500); // Matches CSS transition time
        }
    }, 800);
});


document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. SETUP YEAR PICKER ---
    const yearPicker = document.getElementById("yearPicker");
    const currentYear = new Date().getFullYear();
    
    // Populate Dropdown (Current Year - 10 to Current Year + 5)
    for (let y = currentYear - 10; y <= currentYear + 5; y++) {
        const option = document.createElement("option");
        option.value = y;
        option.text = y;
        if (y === currentYear) option.selected = true;
        yearPicker.appendChild(option);
    }

    // --- 2. HELPERS ---
    function formatRupee(number) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(number);
    }

    function formatCompact(number) {
        return new Intl.NumberFormat("en-IN", {
            notation: "compact",
            compactDisplay: "short",
            style: "currency",
            currency: "INR",
        }).format(number);
    }

    // Mock Data Generator (Simulate backend response based on year)
    function getDataForYear(year) {
        // Base salary increases every year slightly
        const baseSalary = 800000 + (year - 2020) * 50000; 
        
        let monthlyData = [];
        for (let i = 0; i < 12; i++) {
            // Random fluctuation per month
            let randomFactor = 0.8 + Math.random() * 0.4; 
            monthlyData.push(Math.floor(baseSalary * randomFactor));
        }
        return monthlyData;
    }

    // --- 3. CHART INITIALIZATION ---
    const ctx = document.getElementById("payrollChart").getContext("2d");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Create Gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "#FF6B00"); // Orange Start
    gradient.addColorStop(1, "#FFB74D"); // Orange End

    // Initial Data
    let initialData = getDataForYear(currentYear);

    const payrollChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: months,
            datasets: [
                {
                    label: "Total Salary",
                    data: initialData,
                    backgroundColor: gradient,
                    borderRadius: 6,
                    maxBarThickness: 30,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return formatRupee(context.raw);
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return formatCompact(value);
                        },
                        color: "#9ca3af"
                    },
                    grid: { color: "#f3f4f6" }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: "#6b7280" }
                },
            },
        },
    });

    // --- 4. UPDATE LOGIC ---
    function updateDashboard(year) {
        const newData = getDataForYear(year);

        // Update Chart
        payrollChart.data.datasets[0].data = newData;
        payrollChart.update();

        // Update Stats
        const total = newData.reduce((a, b) => a + b, 0);
        const average = total / 12;

        // document.getElementById("totalPayout").textContent = formatRupee(total);
        // document.getElementById("avgPayout").textContent = formatRupee(average);
    }

    // Initial Stats Load
    updateDashboard(currentYear);
    
    fetch(`http://127.0.0.1:8000/api/salary`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalPayout").innerText = data.total_annual_salary;
            document.getElementById("avgPayout").innerText = data.total_monthly_salary;
            
        });
document.getElementById('totalPayout').innerText=
    // --- 5. EVENT LISTENER ---
    yearPicker.addEventListener("change", (e) => {
        updateDashboard(parseInt(e.target.value));
    });

});


//notification section
let notifications = [
  {
    id: 1,
    text: "<strong>Dhamodhar</strong> applied for the UX Designer position.",
    time: "2 mins ago",
    icon: "👩‍💼", // Using emojis as placeholders for images
    read: false,
  },
  {
    id: 2,
    text: "Meeting with <strong>Dev Team</strong> starts in 15 minutes.",
    time: "15 mins ago",
    icon: "📅",
    read: false,
  },
  {
    id: 3,
    text: "New system update available.",
    time: "1 hour ago",
    icon: "⚙️",
    read: true,
  },
  {
    id: 4,
    text: "<strong>Arjun</strong> accepted the offer.",
    time: "3 hours ago",
    icon: "✅",
    read: true,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  // Select Elements
  const bellBtn = document.getElementById("ntBellBtn");
  const dropdown = document.getElementById("ntDropdown");
  const markReadBtn = document.getElementById("ntMarkAllRead");

  // Initialize
  ntRenderList();

  // Toggle Dropdown
  bellBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent immediate closing
    const isVisible = dropdown.style.display === "block";
    dropdown.style.display = isVisible ? "none" : "block";
  });

  // Mark All as Read
  markReadBtn.addEventListener("click", () => {
    notifications.forEach((n) => (n.read = true));
    ntRenderList();
  });

  // Close Dropdown when clicking outside
  window.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});

// Render Function
function ntRenderList() {
  const listContainer = document.getElementById("ntList");
  const badge = document.getElementById("ntBadge");

  // Clear current list
  listContainer.innerHTML = "";

  // Count unread
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Update Badge
  if (unreadCount > 0) {
    badge.style.display = "flex";
    badge.textContent = unreadCount > 9 ? "9+" : unreadCount;
  } else {
    badge.style.display = "none";
  }

  // Check if empty
  if (notifications.length === 0) {
    listContainer.innerHTML = '<div class="nt-empty">No notifications</div>';
    return;
  }

  // Build List
  notifications.forEach((item) => {
    const itemDiv = document.createElement("div");
    // Add class 'nt-unread' if not read
    itemDiv.className = `nt-item ${!item.read ? "nt-unread" : ""}`;

    itemDiv.innerHTML = `
            <div class="nt-avatar">${item.icon}</div>
            <div class="nt-content">
                <p class="nt-text">${item.text}</p>
                <span class="nt-time">${item.time}</span>
            </div>
        `;

    // Click individual item to mark as read
    itemDiv.addEventListener("click", () => {
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
window.onclick = function (event) {
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
};
