import React, { Component } from "react";

import {Bar} from 'react-chartjs-2';

import Chart from 'chart.js/auto';

export class BarChart extends Component{

    render(){

        const { missingValuesPercentage }  = this.props;

        const chartData = {
            labels: Object.keys(missingValuesPercentage || {}),
            datasets: [
              {
                label: 'Missing Values Percentage',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.8)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: Object.values(missingValuesPercentage || {}),
              },
            ],
          };

        return(
            <>  
                {
                    Object.keys(missingValuesPercentage || {}).length > 0 ? (<Bar data={chartData} />) : (<p>No data available for the bar chart.</p>)
                }
            </>
        )
    }

}

export default BarChart;