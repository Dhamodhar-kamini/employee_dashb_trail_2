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