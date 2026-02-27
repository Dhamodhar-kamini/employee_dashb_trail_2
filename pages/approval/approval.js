// Dashboard Dropdown Toggle
document.getElementById("dashboardMenu").onclick = function () {
  this.classList.toggle("open");
  document
    .getElementById("dashboardSubmenu")
    .classList.toggle("open");
};

// document.addEventListener("DOMContentLoaded", function () {
//   const dashboardMenu = document.getElementById("dashboardMenu");
//   const dashboardSubmenu = document.getElementById("dashboardSubmenu");

//   dashboardMenu.addEventListener("click", function () {
//     dashboardSubmenu.classList.toggle("open");
//     dashboardMenu.classList.toggle("active");
//   });
// });
document.addEventListener('DOMContentLoaded', () => {

    // Mock Data based on Image 3
    const leaveRequests = [
        {
            id: 1,
            name: "Bagus Fikri",
            img: "https://i.pravatar.cc/150?img=11",
            type: "Public Holiday",
            dates: "26 Dec 2023 to 27 Dec 2023",
            reason: "To participate in family gathering...",
            file: "Public Holiday-Lea...",
            status: "pending" // pending, approved, rejected
        },
        {
            id: 2,
            name: "Ihdizein",
            img: "https://i.pravatar.cc/150?img=3",
            type: "Sick Leave",
            dates: "18 Sep 2023 to 20 Sep 2023",
            reason: "Dealing with migraine attacks ch...",
            file: "Sick-Leave.pdf",
            status: "pending"
        },
        {
            id: 3,
            name: "Mufti Hidayat",
            img: "https://i.pravatar.cc/150?img=8",
            type: "Maternity Leave",
            dates: "17 Sep 2023 to 21 Sep 2023",
            reason: "To prepare for childbirth and ens...",
            file: "Maternity-Leave.pdf",
            status: "pending"
        },
        {
            id: 4,
            name: "Fauzan Ardhiansyah",
            img: "https://i.pravatar.cc/150?img=12",
            type: "Annual Leave",
            dates: "25 Aug 2023 to 29 Aug 2023",
            reason: "To take a planned vacation and t...",
            file: "Annual-Leave.pdf",
            status: "rejected" // Pre-set status from image
        },
        {
            id: 5,
            name: "Raihan Fikri",
            img: "https://i.pravatar.cc/150?img=59",
            type: "Annual Leave",
            dates: "25 Aug 2023 to 29 Aug 2023",
            reason: "To prioritize personal health and...",
            file: "Annual-Leave.pdf",
            status: "approved" // Pre-set status from image
        },
        {
            id: 6,
            name: "Ifan",
            img: "https://i.pravatar.cc/150?img=60",
            type: "Annual Leave",
            dates: "25 Aug 2023 to 29 Aug 2023",
            reason: "To spend quality time with family...",
            file: "Annual-Leave.pdf",
            status: "rejected"
        },
        {
            id: 7,
            name: "Panji Dwi",
            img: "https://i.pravatar.cc/150?img=68",
            type: "Sick Leave",
            dates: "18 Aug 2023 to 19 Aug 2023",
            reason: "Unexpected project deadlines th...",
            file: "Sick-Leave.pdf",
            status: "approved"
        },
        {
            id: 8,
            name: "Laokta Roymarley",
            img: "https://i.pravatar.cc/150?img=33",
            type: "Sick Leave",
            dates: "20 Aug 2023 to 22 Aug 2023",
            reason: "Sustaining a physical injury such...",
            file: "Sick-Leave.pdf",
            status: "pending"
        }
    ];

    const tableBody = document.getElementById('leaveTableBody');

    function renderTable() {
        tableBody.innerHTML = '';

        leaveRequests.forEach(req => {
            const row = document.createElement('tr');
            
            // Determine Action Column content based on status
            let actionHtml = '';
            
            if (req.status === 'pending') {
                actionHtml = `
                    <div class="action-cell">
                        <button class="btn-action-reject" onclick="updateStatus(${req.id}, 'rejected')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <button class="btn-action-approve" onclick="updateStatus(${req.id}, 'approved')">
                            <i class="fa-solid fa-check"></i> Approve
                        </button>
                    </div>
                `;
            } else if (req.status === 'approved') {
                actionHtml = `<span class="status-badge status-approved"><i class="fa-solid fa-circle-check"></i> Approved</span>`;
            } else if (req.status === 'rejected') {
                actionHtml = `<span class="status-badge status-rejected"><i class="fa-solid fa-circle-xmark"></i> Rejected</span>`;
            }

            row.innerHTML = `
                <td>
                    <div class="emp-cell">
                        <img src="${req.img}" alt="Avatar">
                        <span>${req.name}</span>
                    </div>
                </td>
                <td>${req.type}</td>
                <td class="date-range">${req.dates}</td>
                <td><span class="reason-text">${req.reason}</span></td>
                <td>
                    <a href="#" class="attachment">
                        <i class="fa-regular fa-file-pdf"></i> ${req.file}
                    </a>
                </td>
                <td>${actionHtml}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    // Function to handle clicks
    window.updateStatus = function(id, newStatus) {
        // Find the specific request in the data array
        const request = leaveRequests.find(r => r.id === id);
        if (request) {
            request.status = newStatus; // Update logic
            renderTable(); // Re-render table to show the badge instead of buttons
        }
    }

    // Initial Render
    renderTable();
});