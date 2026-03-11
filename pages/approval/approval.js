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
//     const leaveRequests = [
//         {
//             //     id: 1,
//             //     name: "Bagus Fikri",
//             //     img: "https://i.pravatar.cc/150?img=11",
//             //     type: "Public Holiday",
//             //     dates: "26 Dec 2023 to 27 Dec 2023",
//             //     reason: "To participate in family gathering...",
//             //     file: "Public Holiday-Lea...",
//             //     status: "pending" // pending, approved, rejected
//             // },
//             // {
//             //     id: 2,
//             //     name: "Ihdizein",
//             //     img: "https://i.pravatar.cc/150?img=3",
//             //     type: "Sick Leave",
//             //     dates: "18 Sep 2023 to 20 Sep 2023",
//             //     reason: "Dealing with migraine attacks ch...",
//             //     file: "Sick-Leave.pdf",
//             //     status: "pending"
//             // },
//             // {
//             //     id: 3,
//             //     name: "Mufti Hidayat",
//             //     img: "https://i.pravatar.cc/150?img=8",
//             //     type: "Maternity Leave",
//             //     dates: "17 Sep 2023 to 21 Sep 2023",
//             //     reason: "To prepare for childbirth and ens...",
//             //     file: "Maternity-Leave.pdf",
//             //     status: "pending"
//             // },
//             // {
//             //     id: 4,
//             //     name: "Fauzan Ardhiansyah",
//             //     img: "https://i.pravatar.cc/150?img=12",
//             //     type: "Annual Leave",
//             //     dates: "25 Aug 2023 to 29 Aug 2023",
//             //     reason: "To take a planned vacation and t...",
//             //     file: "Annual-Leave.pdf",
//             //     status: "rejected" // Pre-set status from image
//             // },
//             // {
//             //     id: 5,
//             //     name: "Raihan Fikri",
//             //     img: "https://i.pravatar.cc/150?img=59",
//             //     type: "Annual Leave",
//             //     dates: "25 Aug 2023 to 29 Aug 2023",
//             //     reason: "To prioritize personal health and...",
//             //     file: "Annual-Leave.pdf",
//             //     status: "approved" // Pre-set status from image
//             // },
//             // {
//             //     id: 6,
//             //     name: "Ifan",
//             //     img: "https://i.pravatar.cc/150?img=60",
//             //     type: "Annual Leave",
//             //     dates: "25 Aug 2023 to 29 Aug 2023",
//             //     reason: "To spend quality time with family...",
//             //     file: "Annual-Leave.pdf",
//             //     status: "rejected"
//             // },
//             // {
//                 id: 4,
//                 name: "dhamu",
//                 type: "Sick Leave",
//                 dates: "18 Aug 2023 to 19 Aug 2023",
//                 reason: "Unexpected project deadlines th...",
//                 // file: "Sick-Leave.pdf",
//                 status: "pending"
//             },
//             {
//             id: 1,
//             name: "siddhu",
//             type: "Sick Leave",
//             dates: "20 Aug 2023 to 22 Aug 2023",
//             reason: "Sustaining a physical injury such...",
//             // file: "Sick-Leave.pdf",
//             status: "pending",
//         }
//     ];
    
//     const attendanceRequests = [
//         {
//             id: 2,
//             name: "saleem",
//             requestType: "Missed Punch",
//             date: "10 Mar 2026",
//             log: "09:00 AM - 06:00 PM",
//             reason: "Biometric device did not capture entry.",
//             status: "pending"
//         }
//     ];
//     const assetRequests = [
//         {
//             id: 3,
//             name: "manikanta",
//             asset: "Laptop",
//             location: "Hyderabad",
//             date:"10 Mar 2026",
//             reason: "Current system is very slow for development.",
//             status: "pending"
//         }
//     ];
//     const searchInput = document.getElementById("searchInput");

// searchInput.addEventListener("input", function () {

//     const searchValue = this.value.toLowerCase();

//     // detect active tab
//     if (!document.getElementById("leave-section").classList.contains("hidden")) {

//         const filtered = leaveRequests.filter(req =>
//             req.name.toLowerCase().includes(searchValue)
//         );

//         renderFilteredLeaves(filtered);
//     }

//     else if (!document.getElementById("attendance-section").classList.contains("hidden")) {

//         const filtered = attendanceRequests.filter(req =>
//             req.name.toLowerCase().includes(searchValue)
//         );

//         renderFilteredAttendance(filtered);
//     }

//     else if (!document.getElementById("assets-section").classList.contains("hidden")) {

//         const filtered = assetRequests.filter(req =>
//             req.name.toLowerCase().includes(searchValue)
//         );

//         renderFilteredAssets(filtered);
//     }


// });
// function renderFilteredAttendance(data){

// const tbody = document.querySelector("#attendance-section tbody");
// tbody.innerHTML="";

// data.forEach(req => {

// let actionHtml="";

// if(req.status==="pending"){
// actionHtml=`
// <div class="action-cell">
// <button class="btn-action-reject"
// onclick="updateAttendanceStatus(${req.id},'rejected')">
// <i class="fa-solid fa-xmark"></i>
// </button>

// <button class="btn-action-approve"
// onclick="updateAttendanceStatus(${req.id},'approved')">
// <i class="fa-solid fa-check"></i> Approve
// </button>
// </div>
// `;
// }

// const row=document.createElement("tr");

// row.innerHTML=`
// <td>${req.name}</td>
// <td>${req.requestType}</td>
// <td>${req.date}</td>
// <td>${req.log}</td>
// <td>${req.reason}</td>
// <td>${actionHtml}</td>
// `;

// tbody.appendChild(row);

// });

// }
// function renderFilteredAssets(data){

// const tbody = document.querySelector("#assets-section tbody");
// tbody.innerHTML="";

// data.forEach(req => {

// let actionHtml="";

// if(req.status==="pending"){
// actionHtml=`
// <div class="action-cell">
// <button class="btn-action-reject"
// onclick="updateAssetStatus(${req.id},'rejected')">
// <i class="fa-solid fa-xmark"></i>
// </button>

// <button class="btn-action-approve"
// onclick="updateAssetStatus(${req.id},'approved')">
// <i class="fa-solid fa-check"></i> Approve
// </button>
// </div>
// `;
// }

// const row=document.createElement("tr");

// row.innerHTML=`
// <td>${req.name}</td>
// <td>${req.asset}</td>
// <td>${req.location}</td>
// <td>${req.date}</td>
// <td>${req.reason}</td>
// <td>${actionHtml}</td>
// `;

// tbody.appendChild(row);

// });

// }
    // const tableBody = document.getElementById('leaveTableBody');

    // fetch(`http://127.0.0.1:8000/api/leave-approvals/`)
    //     .then(res => res.json())
    //     .then(data => {
    //         tableBody.innerHTML = "";
    //         console.log(data)
    //         if (!data || data.length === 0) {
    //             payslipTableBody.innerHTML = `<tr><td colspan="4">No leaves found</td></tr>`;
    //             return;
    //         }

    //         data.forEach(p => {
    //             const row = document.createElement("tr");
    //             row.innerHTML = `
    //                 <td>${p.name}</td>
    //                 <td>${p.details}</td>
    //                 <td>₹${p.duration}</td>
    //                 <td>₹${p.days}</td>
    //             `;
    //             tableBody.appendChild(row);
    //         });
    //     })
        // tableBody.innerHTML = '';

    //     leaveRequests.forEach(req => {
    //         const row = document.createElement('tr');

    //         // Determine Action Column content based on status
    //         let actionHtml = '';

    //         if (req.status === 'pending') {
    //             actionHtml = `
    //                 <div class="action-cell">
    //                     <button class="btn-action-reject" onclick="updateStatus(${req.id}, 'rejected')">
    //                         <i class="fa-solid fa-xmark"></i>
    //                     </button>
    //                     <button class="btn-action-approve" onclick="updateStatus(${req.id}, 'approved')">
    //                         <i class="fa-solid fa-check"></i> Approve
    //                     </button>
    //                 </div>
    //             `;
    //         } else if (req.status === 'approved') {
    //             actionHtml = `<span class="status-badge status-approved"><i class="fa-solid fa-circle-check"></i> Approved</span>`;
    //         } else if (req.status === 'rejected') {
    //             actionHtml = `<span class="status-badge status-rejected"><i class="fa-solid fa-circle-xmark"></i> Rejected</span>`;
    //         }

    //         row.innerHTML = `
    //             <td>
    //                 <div class="emp-cell">
    //                     <span>${req.name}</span>
    //                 </div>
    //             </td>
    //             <td>${req.type}</td>
    //             <td class="date-range">${req.dates}</td>
    //             <td><span class="reason-text">${req.reason}</span></td>
    //             <td>
    //                 <a href="#" class="attachment">
    //                     <i class="fa-regular fa-file-pdf"></i> ${req.file}
    //                 </a>
    //             </td>
    //             <td>${actionHtml}</td>
    //         `;

    //         tableBody.appendChild(row);
    //     });
    // }
//     function renderFilteredLeaves(data){

//     tableBody.innerHTML = "";

//     data.forEach(req => {

//         let actionHtml="";

//         if(req.status==="pending"){
//             actionHtml=`
//             <div class="action-cell">
//                 <button class="btn-action-reject"
//                 onclick="updateStatus(${req.id},'rejected')">
//                 <i class="fa-solid fa-xmark"></i>
//                 </button>

//                 <button class="btn-action-approve"
//                 onclick="updateStatus(${req.id},'approved')">
//                 <i class="fa-solid fa-check"></i> Approve
//                 </button>
//             </div>
//             `;
//         }

//         else if(req.status==="approved"){
//             actionHtml=`<span class="status-badge status-approved">
//             <i class="fa-solid fa-circle-check"></i> Approved
//             </span>`;
//         }

//         else{
//             actionHtml=`<span class="status-badge status-rejected">
//             <i class="fa-solid fa-circle-xmark"></i> Rejected
//             </span>`;
//         }

//         const row = document.createElement("tr");

//         row.innerHTML=`
//         <td>
//         <div class="emp-cell">
//         <span>${req.name}</span>
//         </div>
//         </td>

//         <td>${req.type}</td>
//         <td>${req.dates}</td>
//         <td>${req.reason}</td>

//         <td>
//         <i class="fa-regular fa-file-pdf"></i>
//         </td>

//         <td>${actionHtml}</td>
//         `;

//         tableBody.appendChild(row);

//     });

// }

window.approveLeave = function(id) {
    console.log('id:',id)
        fetch(`http://13.60.26.193:8000/api/employee/update/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "approved" })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to approve");
            }
            return res.json();
        })
        
        .catch(err => console.error("Approve error:", err));
    };

    window.rejectLeave = function(id) {
        fetch(`http://13.60.26.193:8000/api/employee/update/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "rejected" })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to reject");
            }
            return res.json();
        })
        // .then(() => fetchLeaves())
        .catch(err => console.error("Reject error:", err));
    }
    // Load data
    // fetchLeaves();

const tableBody = document.getElementById('leaveTableBody');

fetch(`http://13.60.26.193/api/leave-approvals/`)
.then(res => res.json())
.then(response => {

    const data = response.data;

    tableBody.innerHTML = "";
    console.log(data);

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">No leaves found</td></tr>`;
        return;
    }

    data.forEach(p => {

        const actionHtml = `
            <div class="action-cell">
                <button class="btn-action-reject" onclick="rejectLeave(${p.id})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <button class="btn-action-approve" onclick="approveLeave(${p.id})">
                    <i class="fa-solid fa-check"></i> Approve
                </button>
            </div>
        `;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.details}</td>
            <td>${p.duration}</td>
            <td>${p.reason}</td>
            <td>${p.days}</td>
            <td>${actionHtml}</td>
        `;

        tableBody.appendChild(row);

    });

})
.catch(err => {
    console.error("Error fetching leaves:", err);
    tableBody.innerHTML = `<tr><td colspan="6">Failed to load leaves</td></tr>`;
});
    function renderAttendanceTable() {

        const tbody = document.querySelector("#attendance-section tbody");
        tbody.innerHTML = "";

        attendanceRequests.forEach(req => {

            const row = document.createElement("tr");

            let actionHtml = "";

            if (req.status === "pending") {
                actionHtml = `
        <div class="action-cell">
            <button class="btn-action-reject"
            onclick="updateAttendanceStatus(${req.id},'rejected')">
            <i class="fa-solid fa-xmark"></i>
            </button>

            <button class="btn-action-approve"
            onclick="updateAttendanceStatus(${req.id},'approved')">
            <i class="fa-solid fa-check"></i> Approve
            </button>
        </div>
        `;
            }

            else if (req.status === "approved") {
                actionHtml = `<span class="status-badge status-approved">
        <i class="fa-solid fa-circle-check"></i> Approved
        </span>`;
            }

            else {
                actionHtml = `<span class="status-badge status-rejected">
        <i class="fa-solid fa-circle-xmark"></i> Rejected
        </span>`;
            }

            row.innerHTML = `
<td>
  <div class="emp-cell">
    <span>${req.name}</span>
  </div>
</td>

<td>${req.requestType}</td>

<td class="date-range">${req.date}</td>

<td>${req.log}</td>

<td>
<span class="reason-text">${req.reason}</span>
</td>

<td>${actionHtml}</td>
`;


            tbody.appendChild(row);

        });

    }
    function renderAssetTable() {

        const tbody = document.querySelector("#assets-section tbody");
        tbody.innerHTML = "";

        assetRequests.forEach(req => {

            const row = document.createElement("tr");

            let actionHtml = "";

            if (req.status === "pending") {
                actionHtml = `
            <div class="action-cell">

                <button class="btn-action-reject"
                onclick="updateAssetStatus(${req.id},'rejected')">
                <i class="fa-solid fa-xmark"></i>
                </button>

                <button class="btn-action-approve"
                onclick="updateAssetStatus(${req.id},'approved')">
                <i class="fa-solid fa-check"></i> Approve
                </button>

            </div>
            `;
            }

            else if (req.status === "approved") {
                actionHtml = `<span class="status-badge status-approved">
            <i class="fa-solid fa-circle-check"></i> Approved
            </span>`;
            }

            else {
                actionHtml = `<span class="status-badge status-rejected">
            <i class="fa-solid fa-circle-xmark"></i> Rejected
            </span>`;
            }

            row.innerHTML = `
<td>
  <div class="emp-cell">
    <span>${req.name}</span>
  </div>
</td>

<td>${req.asset}</td>

<td class="date-range">${req.location}</td>
<td >${req.date}
</td>
<td>
<span class="reason-text">${req.reason}</span>
</td>


<td>${actionHtml}</td>
`;

            tbody.appendChild(row);

        });

    }
    document.getElementById("approveAllBtn").addEventListener("click", function () {

    leaveRequests.forEach(req => req.status = "approved");
    attendanceRequests.forEach(req => req.status = "approved");
    assetRequests.forEach(req => req.status = "approved");

    renderTable();
    renderAttendanceTable();
    renderAssetTable();
});
const calendarBtn = document.getElementById("calendarBtn");
const calendarInput = document.getElementById("calendarInput");

calendarBtn.addEventListener("click", () => {
    calendarInput.showPicker(); // open calendar
});

calendarInput.addEventListener("change", function(){

    const selectedDate = new Date(this.value);

    const formattedDate = selectedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
});

calendarBtn.innerHTML = `<i class="ph ph-calendar"></i> ${formattedDate}`;
    

    // LEAVES TAB
    if (!document.getElementById("leave-section").classList.contains("hidden")) {

        const filtered = leaveRequests.filter(req => {

            const startDate = new Date(req.dates.split("to")[0].trim());

            return (
                startDate.getFullYear() === selectedDate.getFullYear() &&
                startDate.getMonth() === selectedDate.getMonth()
            );

        });
        calendarBtn.classList.add("calendar-active")

        renderFilteredLeaves(filtered);
    }

    // ATTENDANCE TAB
    else if (!document.getElementById("attendance-section").classList.contains("hidden")) {

        const filtered = attendanceRequests.filter(req => {

            const reqDate = new Date(req.date);

            return (
                reqDate.getFullYear() === selectedDate.getFullYear() &&
                reqDate.getMonth() === selectedDate.getMonth()
            );

        });

        renderFilteredAttendance(filtered);
    }
    else if (!document.getElementById("assets-section").classList.contains("hidden")) {

    const filtered = assetRequests.filter(req => {

        const reqDate = new Date(req.date);

        return (
            reqDate.getFullYear() === selectedDate.getFullYear() &&
            reqDate.getMonth() === selectedDate.getMonth()
        );

    });

    renderFilteredAssets(filtered);
}

});




    // Function to handle clicks
    window.updateStatus = function (id, newStatus) {
        // Find the specific request in the data array
        const request = leaveRequests.find(r => r.id === id);
        if (request) {
            request.status = newStatus; // Update logic
            renderTable(); // Re-render table to show the badge instead of buttons
        }
    }
     window.Updateleave_status = function (id, newStatus) {

        const request = attendanceRequests.find(r => r.id === id);

        if (request) {
            request.status = newStatus;
            renderAttendanceTable();
        }

    }
    window.updateAttendanceStatus = function (id, newStatus) {

        const request = attendanceRequests.find(r => r.id === id);

        if (request) {
            request.status = newStatus;
            renderAttendanceTable();
        }

    }
    window.updateAssetStatus = function (id, newStatus) {

        const request = assetRequests.find(r => r.id === id);

        if (request) {
            request.status = newStatus;
            renderAssetTable();
        }

    }

    // Initial Render
    renderTable();
    renderAttendanceTable();
    renderAssetTable();
});

//notification section

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
} function switchTab(tabName, btnElement) {

    const titleMap = {
        leave: "Leaves",
        attendance: "Attendance",
        assets: "Assets"
    };

    const titleEl = document.getElementById("pageTitle");

    if (titleEl) {
        titleEl.style.opacity = 0;

        setTimeout(() => {
            titleEl.textContent = titleMap[tabName];

            const breadcrumb = document.getElementById("breadcrumbActive");
            if (breadcrumb) {
                breadcrumb.textContent = titleMap[tabName];
            }

            titleEl.style.opacity = 1;
        }, 150);
    }

    document.querySelectorAll(".tab-btn")
        .forEach(btn => btn.classList.remove("active"));

    btnElement.classList.add("active");

    document.querySelectorAll(".table-responsive")
        .forEach(section => section.classList.add("hidden"));

    const target = document.getElementById(tabName + "-section");

    if (target) {
        target.classList.remove("hidden");
        target.classList.add("fade-in");

        setTimeout(() => {
            target.classList.remove("fade-in");
        }, 300);
    }
    document.getElementById("searchInput").value = "";
calendarBtn.innerHTML = `<i class="ph ph-calendar"></i> This Month`;
calendarBtn.classList.remove("calendar-active");
}
function processAction(rowId, actionType) {

    const row = document.getElementById(rowId);

    if (!row) return;

    if (actionType === "Rejected") {
        row.style.backgroundColor = "#fef2f2";
    } else {
        row.style.backgroundColor = "#f0fdf4";
    }

    setTimeout(() => {

        row.style.transition = "all 0.4s ease";
        row.style.transform = "translateX(20px)";
        row.style.opacity = "0";

        setTimeout(() => {

            row.remove();

            const toast = document.getElementById("toast");
            const toastMsg = document.getElementById("toastMsg");

            if (toastMsg) {
                toastMsg.textContent =
                    actionType === "Rejected"
                        ? "Request Rejected"
                        : "Request Approved Successfully";
            }

            if (toast) {
                toast.classList.add("show");

                setTimeout(() => {
                    toast.classList.remove("show");
                }, 3000);
            }

        }, 400);

    }, 200);
}


// document.addEventListener("DOMContentLoaded", function () {
//     const tableBody = document.getElementById('leaveTableBody');
//     actionHtml = `
//                     <div class="action-cell">
//                         <button class="btn-action-reject">
//                             <i class="fa-solid fa-xmark"></i>
//                         </button>
//                         <button class="btn-action-approve">
//                             <i class="fa-solid fa-check"></i> Approve
//                         </button>
//                     </div>
//                 `;
//     fetch(`http://127.0.0.1:8000/api/leave-approvals/`)
//         .then(res => res.json())
//         .then(response => {
//             const data = response.data; // <-- access the array
//             tableBody.innerHTML = "";
//             console.log(data);

//             if (!data || data.length === 0) {
//                 tableBody.innerHTML = `<tr><td colspan="4">No leaves found</td></tr>`;
//                 return;
//             }

//             data.forEach(p => {
//                 const row = document.createElement("tr");
//                 row.innerHTML = `
//                     <td>${p.name}</td>
//                     <td>${p.details}</td>
//                     <td>${p.duration}</td>
//                     <td>${p.reason}</td>
//                     <td>${p.days}</td>
//                     <td>${actionHtml}</td>
//                 `;
//                 tableBody.appendChild(row);
//             });
//         })
//         .catch(err => {
//             console.error("Error fetching leaves:", err);
//             tableBody.innerHTML = `<tr><td colspan="4">Failed to load leaves</td></tr>`;
//         });
// });
