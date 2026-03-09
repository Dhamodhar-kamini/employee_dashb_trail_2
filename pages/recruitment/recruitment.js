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

    // =========================================================
    // PART 1: MODAL & BUTTON LOGIC (High Priority)
    // =========================================================
    const scheduleModal = document.getElementById("hrmExecScheduleModal");
    const openBtn = document.getElementById("hrmExecOpenScheduleBtn");
    const cancelBtn = document.getElementById("hrmExecCancelScheduleBtn");
    const createBtn = document.getElementById("hrmExecCreateEventBtn");

    if (openBtn && scheduleModal) {
        
        // 1. OPEN MODAL
        openBtn.addEventListener("click", function() {
            // Auto-fill today's date
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById("hrmExecInterviewDate");
            if(dateInput) dateInput.value = today;
            
            // Set display to flex to show it
            scheduleModal.style.display = "flex";
        });

        // 2. CLOSE MODAL FUNCTION
        function closeScheduleModal() {
            scheduleModal.style.display = "none";
        }

        // 3. ATTACH CANCEL EVENT
        if(cancelBtn) {
            cancelBtn.addEventListener("click", closeScheduleModal);
        }

        // 4. CLICK OUTSIDE TO CLOSE
        window.onclick = function(event) {
            if (event.target == scheduleModal) {
                closeScheduleModal();
            }
        }
    } else {
        console.error("Critical: Schedule Button or Modal not found in DOM.");
    }

    // =========================================================
    // PART 2: GOOGLE CALENDAR LOGIC
    // =========================================================
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

            // Create Date Objects (using template literals)
            const start = new Date(`${date}T${time}`);
            const end = new Date(start.getTime() + 60 * 60000); // Add 1 hour duration

            // Format date for Google (YYYYMMDDTHHMMSSZ)
            function formatTime(d) {
                return d.toISOString().replace(/[-:]|\.\d+/g, "");
            }

            const calendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatTime(start)}/${formatTime(end)}&details=${encodeURIComponent("Meeting Link: " + meeting)}&location=${encodeURIComponent(meeting)}&sf=true&output=xml`;

            // Open in new tab
            window.open(calendarURL, '_blank');
            
            // Close modal after adding
            if(scheduleModal) scheduleModal.style.display = "none";
        });
    }

    // =========================================================
    // PART 3: CHART LOGIC (Wrapped in Try/Catch)
    // =========================================================
    // We put this last so if it fails, the buttons still work.
    try {
        const chartCanvas = document.getElementById("hrmExecRecruitmentChart");
        
        if (typeof Chart !== 'undefined' && chartCanvas) {
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
                    maintainAspectRatio: false,
                    cutout: "75%",
                    plugins: {
                        legend: { display: false } 
                    }
                }
            });
        }
    } catch (error) {
        console.error("Chart failed to load:", error);
    }
});