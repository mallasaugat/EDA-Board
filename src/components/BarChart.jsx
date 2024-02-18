import React, { Component } from "react";

import {Bar} from 'react-chartjs-2';

import Chart from 'chart.js/auto';

import BarChartUtils from "../model/barUtils";

import PropTypes from 'prop-types';

export class BarChart extends Component {
  render() {
    const { missingValuesPercentage } = this.props;

    // Prepare data for the bar chart
    const chartData = BarChartUtils.prepareBarChartData(missingValuesPercentage);

    return (
      <>
        {Object.keys(missingValuesPercentage || {}).length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p>No data available for the bar chart.</p>
        )}
      </>
    );
  }
}

BarChart.propTypes = {

  missingValuesPercentage: PropTypes.Object

}

export default BarChart;