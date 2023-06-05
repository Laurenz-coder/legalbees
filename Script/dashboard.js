// Get all the <td> elements with the class "mMR-warning-tag"
const warningTags = document.querySelectorAll('.mMR-warning-tag');

// Loop through each <td> element
warningTags.forEach((tag) => {
  // Get the text content of the <td> element
  const warningLevel = tag.textContent;

  // Set the class name based on the warning level
  if (warningLevel === 'high') {
    tag.classList.add('high');
  } else if (warningLevel === 'medium') {
    tag.classList.add('medium');
  } else {
    tag.classList.add('low');
  }
});

const ctx = document.getElementById('myChart').getContext('2d');





Chart.defaults.elements.arc.borderWidth = 0;
Chart.defaults.datasets.doughnut.cutout = '85%';

var chartInstance = new Chart(document.getElementById("myChart"), {
  type: 'doughnut',
  data: {
    labels: [
      'Governance',
      'Social',
      'Enviroment',
      
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [50, 20, 10],
      backgroundColor: [
        '#655be9',
        '#B0A4A4',
        '#7AA874',
        
      ]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }},

  plugins: [{
    
    afterUpdate: function(chart) {
      const arcs = chart.getDatasetMeta(0).data;

      arcs.forEach(function(arc) {
        arc.round = {
          x: (chart.chartArea.left + chart.chartArea.right) / 2,
          y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
          radius: (arc.outerRadius + arc.innerRadius) / 2,
          thickness: (arc.outerRadius - arc.innerRadius) / 2,
          backgroundColor: arc.options.backgroundColor
        }
      });
    },
    afterDraw: (chart) => {
      const {
        ctx,
        canvas
      } = chart;

      chart.getDatasetMeta(0).data.forEach(arc => {
        const startAngle = Math.PI / 2 - arc.startAngle;
        const endAngle = Math.PI / 2 - arc.endAngle;

        ctx.save();
        ctx.translate(arc.round.x, arc.round.y);
        ctx.fillStyle = arc.options.backgroundColor;
        ctx.beginPath();
        ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    }
  }]
});