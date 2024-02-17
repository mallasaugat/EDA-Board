// HistogramUtils.js

class HistogramUtils {
    static generateHistogramData(featureData, featureName) {
      // Calculate the histogram data
      const histogramData = {};
      featureData.forEach((value) => {
        histogramData[value] = (histogramData[value] || 0) + 1;
      });
  
      // Prepare data for chart
      const chartData = {
        labels: Object.keys(histogramData),
        datasets: [
          {
            label: `Histogram for ${featureName}`,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.8)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: Object.values(histogramData),
          },
        ],
      };
  
      return chartData;
    }
  }
  
  export default HistogramUtils;
  