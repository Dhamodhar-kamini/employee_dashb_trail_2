const dateBtn = document.getElementById("dateBtn")

const now = new Date()

dateBtn.textContent = now.toLocaleDateString("en-US",{year:"numeric",month:"short"})

const ctxOverview = document.getElementById("recruitmentChart")

new Chart(ctxOverview,{
type:"doughnut",
data:{
labels:["Applicants","Shortlisted","Hired","Rejected"],
datasets:[{
data:[65,20,10,5],
backgroundColor:["#3b82f6","#f59e0b","#10b981","#cbd5e1"]
}]
},
options:{
cutout:"70%"
}
})

const ctxTime = document.getElementById("timeToHireChart")

new Chart(ctxTime,{
type:"bar",
data:{
labels:["MKT","DEV","DES","SALES"],
datasets:[{
data:[12,25,18,10],
backgroundColor:"#64748b"
}]
}
})


const scheduleModal = document.getElementById("scheduleModal")

function openScheduleModal(){
scheduleModal.style.display="flex"
}

function closeScheduleModal(){
scheduleModal.style.display="none"
}


function createCalendarEvent(){

const title = document.getElementById("interviewTitle").value

const date = document.getElementById("interviewDate").value

const time = document.getElementById("interviewTime").value

const meeting = document.getElementById("meetingLink").value

const start = new Date(`${date}T${time}`)

const end = new Date(start.getTime()+60*60000)

function format(d){
return d.toISOString().replace(/[-:]|\.\d+/g,"")
}

const calendarURL =
`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(start)}/${format(end)}&details=${encodeURIComponent("Meeting Link: "+meeting)}&sf=true&output=xml`

window.open(calendarURL)

closeScheduleModal()

}