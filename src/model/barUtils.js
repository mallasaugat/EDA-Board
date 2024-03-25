function BarChartUtils(missingValuesPercentage){
   
      const chartData = {
        labels: Object.keys(missingValuesPercentage || {}),
        datasets: [
          {
            label: 'Missing Values Percentage',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.8)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: Object.values(missingValuesPercentage || {}),
          },
        ],
      };
      return chartData;
}

export default BarChartUtils;