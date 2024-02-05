import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

export class HistogramChart extends Component {
    // Add a new method to generate histogram data
    generateHistogramData = (featureData, featureName) => {
      // Calculate the histogram data
      const histogramData = {};
      featureData.map((value) => {
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
    };
  
    render() {
      const { featureData, featureName } = this.props;
  
      // Render the histogram for the specified feature
      const histogramChartData = this.generateHistogramData(featureData, featureName);
  
      return (
        <>
          {/* Histogram */}
          {Object.keys(histogramChartData.labels).length > 0 ? (
            <Bar data={histogramChartData} />
          ) : (
            <p>No data available for the histogram.</p>
          )}
        </>
      );
    }
  }

export default HistogramChart;