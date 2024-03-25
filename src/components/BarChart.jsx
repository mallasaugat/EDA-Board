import React from "react";
import { Bar } from 'react-chartjs-2';
import BarChartUtils from "../model/barUtils";
import PropTypes from 'prop-types';

function BarChart({ missingValuesPercentage }) {
  // Prepare data for the bar chart
  const chartData = BarChartUtils(missingValuesPercentage);

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

BarChart.propTypes = {
  missingValuesPercentage: PropTypes.object
}

export default BarChart;
