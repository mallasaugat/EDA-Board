import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import HistogramUtils from "../model/histogramUtils";
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';

const HistogramChart = ({ values, tableRows }) => {
  const [state, setState] = useState({
    histogramFeatureIndex: 0,
    showHistogram: false,
  });

  const handleHistogramIndexChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    if (!isNaN(newIndex)) {
      setState(prevState => ({
        ...prevState,
        histogramFeatureIndex: newIndex,
      }));
    }
  };

  const handleShowHistogram = () => {
    setState(prevState => ({
      ...prevState,
      showHistogram: true,
    }));
  };

  const featureData = values.map((row) => row[state.histogramFeatureIndex]);
  const featureName = tableRows[state.histogramFeatureIndex];
  const histogramChartData = HistogramUtils(featureData, featureName);

  return (
    <>
      {/* Histogram */}
      <label>
        Enter the index for the histogram data:
        <input
          type="number"
          value={state.histogramFeatureIndex}
          onChange={handleHistogramIndexChange}
          className="form-control"
        />
      </label>

      <button onClick={handleShowHistogram} className="btn btn-primary">Press to show Histogram</button>

      {Object.keys(histogramChartData.labels).length > 0 ? (
        <Bar data={histogramChartData} />
      ) : (
        <p>No data available for the histogram.</p>
      )}
    </>
  );
};

HistogramChart.propTypes = {
  values: PropTypes.object,
  tableRows: PropTypes.object
};

export default HistogramChart;
