import React, { Component } from "react";
import PropTypes from 'prop-types';


function DataDescription({numericalStats}){

    return (
        <div>
            <h3>Numerical Feature Descriptions:</h3>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Feature</th>
                            <th>Count</th>
                            <th>Mean</th>
                            <th>Standard Deviation</th>
                            <th>Minimum</th>
                            <th>25th Percentile (First Quartile)</th>
                            <th>Median</th>
                            <th>75th Percentile (Third Quartile)</th>
                            <th>Maximum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(numericalStats).map(([feature, stats]) => (
                            <tr key={feature}>
                                <td>{feature}</td>
                                <td>{stats.count}</td>
                                <td>{stats.mean}</td>
                                <td>{stats.std}</td>
                                <td>{stats.min}</td>
                                <td>{stats.firstQuartile}</td>
                                <td>{stats.median}</td>
                                <td>{stats.thirdQuartile}</td>
                                <td>{stats.max}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


DataDescription.propTypes = {
    numericalStats: PropTypes.object
};

export default DataDescription;
