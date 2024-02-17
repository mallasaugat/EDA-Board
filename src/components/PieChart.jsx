import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import PieChartUtils from "../model/pieUtils";

export class PieChart extends Component {
  render() {
    const { categoricalFeatures, numericalFeatures } = this.props;

    // Prepare data for the pie chart
    const pieChartData = PieChartUtils.preparePieChartData(categoricalFeatures, numericalFeatures);

    return (
      <>
        <div style={{ width: '50%', margin: 'auto' }}>
          <h2>Number of Categorical and Numerical Features</h2>
          <Pie data={pieChartData} />
        </div>
      </>
    );
  }
}

export default PieChart;
