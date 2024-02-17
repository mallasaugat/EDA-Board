import React, { Component } from "react";

import { Pie } from "react-chartjs-2";
import Chart from 'chart.js/auto';

export class PieChart extends Component{

    

    render(){

        const {categoricalFeatures, numericalFeatures} = this.props;

         // Prepare data for the pie chart
        const pieChartData = {
            labels: ['Categorical', 'Numerical'],
            datasets: [{
                data: [Object.keys(categoricalFeatures).length, Object.keys(numericalFeatures).length],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            }]
        };

        return(
            <>  

            <div style={{ width: '50%', margin: 'auto' }}>
                <h2>Number of Categorical and Numerical Features</h2>
                <Pie data={pieChartData} />
            </div>

            </>
        )

    }

}

export default PieChart;