
// import { loadedsites } from "./variables.js";

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


  getComputedStyle(document.documentElement)
    .getPropertyValue('--red-color'),
  getComputedStyle(document.documentElement)
    .getPropertyValue('--warning-color'),
  getComputedStyle(document.documentElement)
    .getPropertyValue('--main-color')
];






const data = {
  labels: ['bad', 'medium', 'good'],
  datasets: [{
    label: 'Weekly Sales',
    data: [50, 30, 20],
    backgroundColor: col,
    borderWidth: 1,
    circumference: 180,
    rotation: 270,
    cutout: "85%",
    needleValue: updateChart(),
    borderRadius: 30
  }]
};

const gaugeNeedle = {
  id: "gaugeNeedle",
  afterDatasetsDraw(chart, args, plugins) {
    const { ctx, data } = chart;

    ctx.save();

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
  data: data,
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


//////////////////////// setup 


const data2 = {
  labels: ['filled', ''],
  datasets: [{
    label: 'Directives fullfilled',
    data: [updateChart(), 100-updateChart()],
    fill: false,
    backgroundColor: [
      getComputedStyle(document.documentElement)
        .getPropertyValue('--main-color'),
      'transparent'
    ],
    borderColor: [
      getComputedStyle(document.documentElement)
        .getPropertyValue('--main-color'),
      'transparent'
    ],
    borderWidth: 1,
    cutout: '75%',
    borderRadius: 25,
  
  
  }]
};

const gaugeFlowMeter2 = {
  id: "gaugeFlowMeter2",
  afterDatasetsDraw(chart, args, pluginOptions) {
    const { ctx, data } = chart;

    ctx.save()
    const xCenter = chart.getDatasetMeta(0).data[0].x;
    const yCenter = chart.getDatasetMeta(0).data[0].y;
        // flowmeter

    ctx.font = "bold 15px Inter";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle'
    ctx.fillText(`${updateChart().toFixed(0)}%`, xCenter, yCenter );

    console.log(ctx);

  }
}






// config 
const configuration = {
  type: 'doughnut',
  data: data2,
  options: {
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
  plugins: [gaugeFlowMeter2]
};



// render init block

const directive_chart = new Chart(
  document.getElementById("directive-chart").getContext("2d"),
  configuration
);
//////////////////////////////


function updateChart() {
  var totalDirectives = loadedsites.length;
  let totalChecked = 0;
  let totalNumTotal = 0;
  for (let i = 0; i < loadedsites.length; i++) {
    totalChecked += loadedsites[i].numchecked;
    totalNumTotal += loadedsites[i].numtotal;

  }


  return (totalChecked / totalNumTotal) * 100;

}









function expandPillar() {
  var gridContainer = document.getElementById("active");
  var targetElements = Array.from(document.getElementsByClassName("sub-pillar"));

  gridContainer.addEventListener('click', () => {
    targetElements.forEach(element => {
      element.classList.toggle("inactive");

    });
  });
}

function fillSubPillar() {
  const el = document.getElementById("insights-pillars-container");

  for (let i = 0; i < loadedsites.length; i++) {
    let dir = loadedsites[i];
    let div = document.createElement("div");
    div.style.gridArea = `div${i + 4}`;
    div.classList.add("box-layout", "sub-pillar", "inactive", `div${i + 4}`);

    let span = document.createElement("span");
    span.classList.add("material-symbols-outlined");

    let mMIEContentArea = document.createElement("div");
    mMIEContentArea.classList.add("mMIE-content-area");

    let mMIECTextArea = document.createElement("div");
    mMIECTextArea.classList.add("mMIEC-text-area");

    let h3 = document.createElement("h3");
    h3.textContent = dir.shortname;

    let h1 = document.createElement("h1");
    h1.textContent = `${dir.numchecked} / ${dir.numtotal}`;

    // Add appropriate symbol based on directive
    if (dir.directive === "CSRD") {
      span.textContent = "spa";
    } else {
      span.textContent = "filter_list";
    }

    // Append the elements in the required hierarchy
    mMIECTextArea.appendChild(h3);
    mMIECTextArea.appendChild(h1);
    mMIEContentArea.appendChild(span);
    mMIEContentArea.appendChild(mMIECTextArea);
    div.appendChild(mMIEContentArea);
    el.appendChild(div);
  }
}


function updateDirectives() {
  var totalDirectives = loadedsites[0].length;
  let totalChecked = 0;
  let totalNumTotal = 0;
  for (let i = 0; i < loadedsites.length; i++) {
    totalChecked += loadedsites[i].numchecked;
    totalNumTotal += loadedsites[i].numtotal;

  }
  const element = document.getElementsByClassName("mMIEC-text-area");
 
  console.log(element);
  element[0].innerHTML = `<h3>Directive</h3><h1>${totalChecked} / ${totalNumTotal}</h1>`;
}

function updateDisplayValue(){
  // Create mMIEGP-number div
let mMIEGPNumberDiv = document.createElement("div");
mMIEGPNumberDiv.classList.add("mMIEGP-number");

let p = document.createElement("p");
p.textContent = updateChart();

mMIEGPNumberDiv.appendChild(p);

}




updateDirectives();

fillSubPillar();

expandPillar();
