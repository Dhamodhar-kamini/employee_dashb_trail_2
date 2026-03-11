const monthPicker = document.getElementById("monthPicker");

const now = new Date();

const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth()+1).padStart(2,"0");

monthPicker.value = `${currentYear}-${currentMonth}`;
monthPicker.max = `${currentYear}-${currentMonth}`;
monthPicker.min = `${currentYear-50}-01`;


function formatRupee(number){

return new Intl.NumberFormat('en-IN',{

style:'currency',
currency:'INR',
maximumFractionDigits:0

}).format(number);

}


function formatCompact(number){

return new Intl.NumberFormat('en-IN',{

notation:"compact",
compactDisplay:"short",
style:'currency',
currency:'INR'

}).format(number);

}


function getDataForYear(year){

const baseSalary = 800000 + ((year-2000)*50000);

let monthlyData=[];

for(let i=0;i<12;i++){

let randomFactor = 0.8 + Math.random()*0.4;

monthlyData.push(Math.floor(baseSalary*randomFactor));

}

return monthlyData;

}


const ctx = document.getElementById("payrollChart").getContext("2d");

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let currentData = getDataForYear(currentYear);


let gradient = ctx.createLinearGradient(0,0,0,400);

gradient.addColorStop(0,'#c2410c');
gradient.addColorStop(1,'#fb923c');


const payrollChart = new Chart(ctx,{

type:'bar',

data:{
labels:months,
datasets:[{
label:'Salary',
data:currentData,
backgroundColor:gradient,
borderRadius:6,
maxBarThickness:30
}]
},

options:{

responsive:true,
maintainAspectRatio:false,

plugins:{
legend:{display:false},

tooltip:{
callbacks:{
label:function(context){

return formatRupee(context.raw);

}
}
}

},

scales:{

y:{
beginAtZero:true,
ticks:{
callback:function(value){

return formatCompact(value);

}
}
},

x:{
grid:{display:false}
}

}

}

});


function updateDashboard(dateString){

const year = parseInt(dateString.split('-')[0]);

const newData = getDataForYear(year);

payrollChart.data.datasets[0].data = newData;

payrollChart.update();


const total = newData.reduce((a,b)=>a+b,0);

const average = total/12;


document.getElementById("totalPayout").textContent = formatRupee(total);

document.getElementById("avgPayout").textContent = formatRupee(average);

}


updateDashboard(`${currentYear}-${currentMonth}`);


monthPicker.addEventListener("change",(e)=>{

if(e.target.value){

updateDashboard(e.target.value);

}

});

//notification section
//notification section
let notifications = [
    {
        id: 1,
        text: "<strong>Dhamodhar</strong> applied for the UX Designer position.",
        time: "2 mins ago",
        icon: "👩‍💼", // Using emojis as placeholders for images
        read: false
    },
    {
        id: 2,
        text: "Meeting with <strong>Dev Team</strong> starts in 15 minutes.",
        time: "15 mins ago",
        icon: "📅",
        read: false
    },
    {
        id: 3,
        text: "New system update available.",
        time: "1 hour ago",
        icon: "⚙️",
        read: true
    },
    {
        id: 4,
        text: "<strong>Arjun</strong> accepted the offer.",
        time: "3 hours ago",
        icon: "✅",
        read: true
    }
];

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
}