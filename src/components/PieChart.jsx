import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import PieChartUtils from "../model/pieUtils";

import PropTypes from 'prop-types';

function PieChart({ categoricalFeatures, numericalFeatures }){

  // Prepare data for the pie chart
  const pieChartData = PieChartUtils(categoricalFeatures, numericalFeatures);

  return (
    <>
      <div style={{ width: '50%', margin: 'auto' }}>
        <h2>Number of Categorical and Numerical Features</h2>
        <Pie data={pieChartData} />
      </div>
    </>
  );
}


PieChart.propTypes = {

  categoricalFeatures: PropTypes.Object,
  numericalFeatures: PropTypes.Object

}

export default PieChart;
