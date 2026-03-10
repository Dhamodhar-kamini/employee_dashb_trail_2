let tickets = [
    { subject: 'Unable to access Payroll', name: 'Maisha Lucy', email: 'maisha.lucy@smarthr.com', status: 'Open' },
    { subject: 'Need new monitor', name: 'Thomas G.', email: 'thomas.g@smarthr.com', status: 'Open' },
    { subject: 'Password Reset', name: 'Uma Stafford', email: 'uma.stafford@smarthr.com', status: 'Closed' },
    { subject: 'VPN Connection Failed', name: 'Khubaib A.', email: 'khubaib.a@smarthr.com', status: 'Open' },
    { subject: 'Software Installation', name: 'Zamora Peck', email: 'zamora.peck@smarthr.com', status: 'Closed' }
];

let currentIdx = null;

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    document.getElementById('ticketCount').innerText = tickets.length;

    tickets.forEach((ticket, index) => {
        const isOpen = ticket.status === 'Open';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="serial-id">${index + 1}</td>
            <td class="subject-text">${ticket.subject}</td>
            <td>
                <div class="user-info">
                    <h4>${ticket.name}</h4>
                    <span>${ticket.email}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${isOpen ? 'status-open' : 'status-closed'}">
                    ${ticket.status}
                </span>
            </td>
            <td style="text-align: right;">
                <button class="action-btn" onclick="openModal(${index})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal(index) {
    currentIdx = index;
    const ticket = tickets[index];
    document.getElementById('editName').value = ticket.name;
    document.getElementById('editEmail').value = ticket.email;
    document.getElementById('editStatus').value = ticket.status;
    document.getElementById('editModal').classList.add('active');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

function saveChanges(e) {
    e.preventDefault();
    tickets[currentIdx].name = document.getElementById('editName').value;
    tickets[currentIdx].email = document.getElementById('editEmail').value;
    tickets[currentIdx].status = document.getElementById('editStatus').value;
    renderTable();
    closeModal();
}

// Initial render
renderTable();