import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

export class HistogramChart extends Component {
    constructor(props){

      super(props);

      this.state = {
        histogramData: {},
            histogramFeatureIndex: 0,
            showHistogram: false,
      }

    }

      handleHistogramIndexChange = (event) => {
        const newIndex = parseInt(event.target.value, 10);
        if(!isNaN(newIndex)){
            this.setState({
                histogramFeatureIndex: newIndex,
            });
        }
    };

    handleShowHistogram = () => {
        this.setState({
            showHistogram: true,
        });
    };

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
      const { values, tableRows } = this.props;


      const featureData = values.map((row) => row[this.state.histogramFeatureIndex]);
      const featureName = tableRows[this.state.histogramFeatureIndex]
  
      // Render the histogram for the specified feature
      const histogramChartData = this.generateHistogramData(featureData, featureName);
  
      return (
        <>
          {/* Histogram */}

          <label>
                    Enter the index for the histogram data:
                    <input
                        type="number"
                        value={this.state.histogramFeatureIndex}
                        onChange={this.handleHistogramIndexChange}
                        className="form-control"
                    />
            </label>

            <button onClick={this.handleShowHistogram} className="btn btn-primary">Press to show Histogram</button>

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