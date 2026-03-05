document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. TICKET DATA & TABLE RENDERING
    // ==========================================
    const tickets = [
        { id: "#TCK-2024", subject: "Unable to access Payroll", requester: "Maisha Lucy", img: "../assets/profiledp.jpeg", priority: "High", status: "Open", date: "Oct 24, 2025", desc: "I get a 403 error when clicking the payroll tab." },
        { id: "#TCK-2025", subject: "Need new monitor", requester: "Thomas G.", img: "../assets/profiledp.jpeg", priority: "Medium", status: "Open", date: "Oct 23, 2025", desc: "My screen is flickering intermittently." },
        { id: "#TCK-2026", subject: "Password Reset", requester: "Uma Stafford", img: "../assets/profiledp.jpeg", priority: "Low", status: "Closed", date: "Oct 22, 2025", desc: "Locked out of my account." },
        { id: "#TCK-2027", subject: "VPN Connection Failed", requester: "Khubaib A.", img: "../assets/profiledp.jpeg", priority: "High", status: "Open", date: "Oct 21, 2025", desc: "Cannot connect to the US server." },
        { id: "#TCK-2028", subject: "Software Installation", requester: "Zamora Peck", img: "../assets/profiledp.jpeg", priority: "Low", status: "Closed", date: "Oct 20, 2025", desc: "Requesting VS Code installation." }
    ];

    const tableBody = document.getElementById("ticketTableBody");
    const filterSelect = document.getElementById("ticketFilter");

    function renderTable(filterStatus = "all") {
        if(!tableBody) return;
        tableBody.innerHTML = "";

        const filtered = tickets.filter(t => filterStatus === "all" || t.status === filterStatus);

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color:#999;">No tickets found.</td></tr>`;
            return;
        }

        filtered.forEach(ticket => {
            const prioClass = ticket.priority.toLowerCase();
            const statusClass = ticket.status.toLowerCase();
            const statusIcon = statusClass === 'open' ? 'fa-circle-exclamation' : 'fa-circle-check';

            const row = `
                <tr>
                    <td class="ticket-id">${ticket.id}</td>
                    <td style="font-weight: 500;">${ticket.subject}</td>
                    <td>
                        <div class="user-cell">
                            <img src="${ticket.img}" alt="u">
                            <span>${ticket.requester}</span>
                        </div>
                    </td>
                    <td><span class="prio-badge ${prioClass}">${ticket.priority}</span></td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            <i class="fa-solid ${statusIcon}"></i> ${ticket.status}
                        </span>
                    </td>
                    <td style="color:var(--text-grey);">${ticket.date}</td>
                    <td>
                        <button class="btn-view" onclick="openTicketModal('${ticket.id}')">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    renderTable(); // Init

    if(filterSelect) {
        filterSelect.addEventListener("change", (e) => {
            renderTable(e.target.value);
        });
    }

    // ==========================================
    // 2. CHART CONFIGURATION
    // ==========================================
    const chartCanvas = document.getElementById('statusDoughnutChart');
    if(chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Open', 'Solved', 'Closed'],
                datasets: [{
                    data: [28, 104, 10],
                    backgroundColor: ['#FF6B00', '#05CD99', '#EFF4FB'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '75%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });
    }

    // ==========================================
    // 3. DROPDOWN MENU LOGIC (Fixed)
    // ==========================================
      const menuBtn = document.getElementById('chartMenuBtn');
    const dropdown = document.getElementById('chartMenuDropdown');

    if (menuBtn && dropdown) {
        
        // 1. Toggle Menu on Click
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stops the click from bubbling to window
            
            // Toggle classes
            dropdown.classList.toggle('show');
            menuBtn.classList.toggle('active');
        });

        // 2. Close Menu when clicking ANYWHERE else
        document.addEventListener('click', function(e) {
            // Check if click is OUTSIDE the dropdown AND OUTSIDE the button
            if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                dropdown.classList.remove('show');
                menuBtn.classList.remove('active');
            }
        });

    } else {
        console.error("Dropdown elements not found! Check IDs.");
    }

    // ==========================================
    // 4. MODAL LOGIC
    // ==========================================
    const modal = document.getElementById('ticketModal');
    const closeBtn = document.getElementById('closeTicketModal');

    // Make function global so HTML onclick works
    window.openTicketModal = function(id) {
        const ticket = tickets.find(t => t.id === id);
        if(!ticket) return;

        // Populate Data
        document.getElementById('modalSubject').innerText = ticket.subject;
        document.getElementById('modalId').innerText = ticket.id;
        document.getElementById('modalRequester').innerText = ticket.requester;
        
        const prioEl = document.getElementById('modalPriority');
        prioEl.innerText = ticket.priority;
        prioEl.className = `prio-badge ${ticket.priority.toLowerCase()}`;

        document.getElementById('modalDate').innerText = ticket.date;
        document.getElementById('modalDesc').innerText = ticket.desc;

        // Show Modal
        if(modal) modal.classList.add('active');
    };

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });

});