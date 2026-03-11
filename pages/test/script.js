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