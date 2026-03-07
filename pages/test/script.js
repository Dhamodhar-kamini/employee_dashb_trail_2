document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Chart Configuration
    const ctxOverview = document.getElementById("recruitmentChart").getContext('2d');
    new Chart(ctxOverview, {
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

    // 2. Modal Logic variables
    const scheduleModal = document.getElementById("scheduleModal");
    const openBtn = document.getElementById("openScheduleBtn");
    const cancelBtn = document.getElementById("cancelScheduleBtn");
    const createBtn = document.getElementById("createEventBtn");

    // Open Modal
    openBtn.addEventListener("click", function() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("interviewDate").value = today;
        scheduleModal.style.display = "flex";
    });

    // Close Modal functions
    function closeScheduleModal() {
        scheduleModal.style.display = "none";
    }

    cancelBtn.addEventListener("click", closeScheduleModal);

    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target == scheduleModal) {
            closeScheduleModal();
        }
    }

    // 3. Google Calendar Logic
    createBtn.addEventListener("click", function() {
        const title = document.getElementById("interviewTitle").value || "Job Interview";
        const date = document.getElementById("interviewDate").value;
        const time = document.getElementById("interviewTime").value;
        const meeting = document.getElementById("meetingLink").value || "Online";

        if(!date || !time) {
            alert("Please select a date and time.");
            return;
        }

        // Create Date Objects
        const start = new Date(`${date}T${time}`);
        // Default duration 1 hour
        const end = new Date(start.getTime() + 60 * 60000);

        // Format for Google URL (YYYYMMDDTHHMMSSZ)
        function formatTime(d) {
            return d.toISOString().replace(/[-:]|\.\d+/g, "");
        }

        const calendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatTime(start)}/${formatTime(end)}&details=${encodeURIComponent("Meeting Link: " + meeting)}&location=${encodeURIComponent(meeting)}&sf=true&output=xml`;

        // Open in new tab
        window.open(calendarURL, '_blank');
        closeScheduleModal();
    });

});