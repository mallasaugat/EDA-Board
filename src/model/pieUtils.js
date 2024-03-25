// PieChartUtils.js

function PieChartUtils(categoricalFeatures, numericalFeatures){

  // Prepare data for the pie chart
  const pieChartData = {
    labels: ['Categorical', 'Numerical'],
    datasets: [{
      data: [Object.keys(categoricalFeatures).length, Object.keys(numericalFeatures).length],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB'],
    }]
  };

  return pieChartData;

}

export default PieChartUtils;
  