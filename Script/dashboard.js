
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

const col = [
  
  
  "#CE5959",
  "#ffbb55",
  "#7D9177"];


const data = {
  labels: ['bad', 'medium', 'Wed'],
  datasets: [{
    label: 'Weekly Sales',
    data: [50,30,20],
    backgroundColor: col,
    borderWidth: 1,
    circumference: 180,
    rotation: 270,
    cutout: "85%",
    needleValue: 0,
    borderRadius: 30
  }]
};

const gaugeNeedle = {
  id: "gaugeNeedle",
  afterDatasetsDraw(chart, args, plugins) {
    const { ctx, data } = chart;

    ctx.save();
    console.log(chart.getDatasetMeta(0).data);
    const xCenter = chart.getDatasetMeta(0).data[0].x;
    const yCenter = chart.getDatasetMeta(0).data[0].y;
    const outRad = chart.getDatasetMeta(0).data[0].outerRadius;
    const innerRad = chart.getDatasetMeta(0).data[0].innerRadius;
    const widthSlice = (outRad - innerRad) / 2;
    const radius = 15;
    const angle = Math.PI / 180;

    const needleValue = data.datasets[0].needleValue;

    const dataTotal = data.datasets[0].data.reduce((a, b) =>
      a + b, 0);

    const circumference = (((chart.getDatasetMeta(0).data[0].circumference / Math.PI) /
      data.datasets[0].data[0]) * needleValue);


    ctx.translate(xCenter, yCenter);
    ctx.rotate(Math.PI * (circumference + 1.5));

    //needle
    ctx.beginPath();
    ctx.strokeStyle = "grey";
    ctx.fillStyle = "grey";
    ctx.lineWidth = 1;
    ctx.moveTo(0 - 15, 0);
    ctx.lineTo(0, 0 - innerRad - widthSlice);
    ctx.lineTo(0 + 15, 0);
    ctx.stroke();
    ctx.stroke();
    ctx.fill();

    // dot
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, angle * 360, false);
    ctx.fill();

    ctx.restore();



  }
}

// gaugeFlowMeter
const gaugeFlowMeter = {
  id: "gaugeFlowMeter",
  afterDatasetsDraw(chart, args, plugins) {
    const { ctx, data } = chart;

    ctx.save()
    const needleValue = data.datasets[0].needleValue;
    const xCenter = chart.getDatasetMeta(0).data[0].x;
    const yCenter = chart.getDatasetMeta(0).data[0].y;
    const circumference = (((chart.getDatasetMeta(0).data[0].circumference / Math.PI) /
      data.datasets[0].data[0]) * needleValue);

    const perc = circumference * 100;

    // flowmeter

    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = "grey";
    ctx.textAlign = "center";
    ctx.fillText(`${perc.toFixed(0)}%`, xCenter, yCenter + 40);



  }
}




// config 
const config = {
  type: 'doughnut',
  data,
  options: {
    layout: {
      padding: {
        bottom: 50
      }
    },

    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  },
  plugins: [gaugeNeedle, gaugeFlowMeter]
};

// render init block
const myChart = new Chart(
  document.getElementById('doughnut-chart').getContext("2d"),
  config
);

