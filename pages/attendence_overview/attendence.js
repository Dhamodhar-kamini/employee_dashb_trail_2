document.addEventListener('DOMContentLoaded', () => {
    const detailModal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-btn');
    const clickableStats = document.querySelectorAll('.clickable-stat');

    // Dummy Data Structure
    const ATTENDANCE_DATA = {
        'Present': [
            { name: "John Doe", role: "Designer", time: "Today" },
            { name: "Jane Smith", role: "QA", time: "26/12 - 4/1" },
            { name: "Alex Lee", role: "Back-end Developer", time: "Tomorrow" },
            { name: "Chris B.", role: "QA", time: "Today" },
            { name: "Emily R.", role: "Designer", time: "Tomorrow" },
            { name: "Mark T.", role: "Designer", time: "26/12 - 4/1" },
            { name: "Sarah K.", role: "Front-end Developer", time: "28/12" },
            { name: "Tom H.", role: "Project Lead", time: "Today" },
            { name: "Alice B.", role: "Intern", time: "29/12" },
        ],
        'OnLeave': [
            { name: "Michael J.", role: "Sick Leave", date: "23/12/2020" },
            { name: "Laura M.", role: "Marriage", date: "23/12/2020" },
            { name: "Peter G.", role: "Holiday", date: "23/12/2020" },
            { name: "Sam R.", role: "Vacation", date: "27/12/2020" },
        ],
        'Late': [
            { name: "David W.", role: "Late arrival", time: "09:45 AM" },
            { name: "Fiona H.", role: "Late arrival", time: "09:30 AM" },
            { name: "Gary L.", role: "Late arrival", time: "09:15 AM" },
        ]
    };

    function openModal(type) {
        modalTitle.textContent = `${type} Details`;
        let html = `<ul class="modal-detail-list">`;
        
        const data = ATTENDANCE_DATA[type] || [];

        if (type === 'Present' || type === 'Late') {
             data.forEach(item => {
                html += `
                    <li>
                        <img src="https://via.placeholder.com/30/${type === 'Late' ? 'EF5350' : '42A5F5'}/ffffff?text=${item.name.charAt(0)}" alt="${item.name}">
                        <div>
                            <strong>${item.name}</strong>
                            <small>${item.role}</small>
                        </div>
                        <span class="detail-time">${item.time}</span>
                    </li>
                `;
            });
        } else { // OnLeave
             data.forEach(item => {
                html += `
                    <li>
                        <img src="https://via.placeholder.com/30/66BB6A/ffffff?text=${item.name.charAt(0)}" alt="${item.name}">
                        <div>
                            <strong>${item.name}</strong>
                            <small>${item.role}</small>
                        </div>
                        <span class="detail-date">${item.date}</span>
                    </li>
                `;
            });
        }

        html += `</ul>`;
        modalBody.innerHTML = html;
        detailModal.style.display = "block";
    }

    function closeModal() {
        detailModal.style.display = "none";
    }

    // Attach click handlers to stats
    clickableStats.forEach(stat => {
        stat.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            openModal(type);
        });
    });

    // Modal controls
    closeBtn.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target === detailModal) {
            closeModal();
        }
    };
});