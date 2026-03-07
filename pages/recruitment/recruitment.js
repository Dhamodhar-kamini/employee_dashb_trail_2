// Sidebar Toggle
document.getElementById("toggleBtn").onclick=function(){
  document.getElementById("sidebar").classList.toggle("active");
};

// Donut Chart
new Chart(document.getElementById("donutChart"),{
  type:'doughnut',
  data:{
    datasets:[{
      data:[74,26],
      backgroundColor:['#ff6b35','#eaeaea'],
      borderWidth:0
    }]
  },
  options:{
    cutout:'75%',
    plugins:{legend:{display:false}},
    responsive:true
  }
});

// Bar Chart
new Chart(document.getElementById("barChart"),{
  type:'bar',
  data:{
    labels:['Jan','Feb','Mar'],
    datasets:[{
      data:[10,15,12],
      backgroundColor:'#1e88e5'
    }]
  },
  options:{plugins:{legend:{display:false}},responsive:true}
});



// recruitment section
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Chart Configuration ---
    const chartCanvas = document.getElementById("hrmExecRecruitmentChart");
    
    if (chartCanvas) {
        new Chart(chartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Applicants", "Shortlisted", "Hired", "Rejected"],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#cbd5e1"],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Important for fitting container
                cutout: "75%",
                plugins: {
                    legend: { display: false } 
                }
            }
        });
    } else {
        console.error("Chart canvas not found!");
    }

    // --- 2. Modal Logic ---
    const scheduleModal = document.getElementById("hrmExecScheduleModal");
    const openBtn = document.getElementById("hrmExecOpenScheduleBtn");
    const cancelBtn = document.getElementById("hrmExecCancelScheduleBtn");
    const createBtn = document.getElementById("hrmExecCreateEventBtn");

    if (openBtn && scheduleModal) {
        // Open Modal
        openBtn.addEventListener("click", function() {
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById("hrmExecInterviewDate");
            if(dateInput) dateInput.value = today;
            
            scheduleModal.style.display = "flex";
        });

        // Close Modal functions
        function closeScheduleModal() {
            scheduleModal.style.display = "none";
        }

        if(cancelBtn) {
            cancelBtn.addEventListener("click", closeScheduleModal);
        }

        // Close when clicking outside
        window.onclick = function(event) {
            if (event.target == scheduleModal) {
                closeScheduleModal();
            }
        }
    } else {
        console.error("Modal buttons not found.");
    }

    // --- 3. Google Calendar Logic ---
    if(createBtn) {
        createBtn.addEventListener("click", function() {
            const title = document.getElementById("hrmExecInterviewTitle").value || "Job Interview";
            const date = document.getElementById("hrmExecInterviewDate").value;
            const time = document.getElementById("hrmExecInterviewTime").value;
            const meeting = document.getElementById("hrmExecMeetingLink").value || "Online";

            if(!date || !time) {
                alert("Please select a date and time.");
                return;
            }

            // Create Date Objects
            const start = new Date(`${date}T${time}`);
            // Default duration 1 hour
            const end = new Date(start.getTime() + 60 * 60000);

            // Format for Google URL
            function formatTime(d) {
                return d.toISOString().replace(/[-:]|\.\d+/g, "");
            }

            const calendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatTime(start)}/${formatTime(end)}&details=${encodeURIComponent("Meeting Link: " + meeting)}&location=${encodeURIComponent(meeting)}&sf=true&output=xml`;

            // Open in new tab
            window.open(calendarURL, '_blank');
            
            // Hide modal
            if(scheduleModal) scheduleModal.style.display = "none";
        });
    }
});