import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

import HistogramUtils from "../model/histogramUtils";

export class HistogramChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      histogramFeatureIndex: 0,
      showHistogram: false,
    };
  }

  handleHistogramIndexChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    if (!isNaN(newIndex)) {
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

  render() {
    const { values, tableRows } = this.props;
    const featureData = values.map((row) => row[this.state.histogramFeatureIndex]);
    const featureName = tableRows[this.state.histogramFeatureIndex];

    // Render the histogram for the specified feature
    const histogramChartData = HistogramUtils.generateHistogramData(featureData, featureName);

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