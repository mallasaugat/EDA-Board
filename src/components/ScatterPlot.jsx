import React, { Component } from "react";

import { Scatter } from 'react-chartjs-2';

export class ScatterPlot extends Component{

    
      render(){

        const { data, xLabel, yLabel } = this.props;

        const chartData = {
            datasets: [
              {
                label: 'Scatter Plot',
                data: data,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              },
            ],
          };
        
          const options = {
            scales: {
              xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                  display: true,
                  labelString: xLabel,
                },
              }],
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: yLabel,
                },
              }],
            },
          };

        
        return(
            <>  

            <div>
                <Scatter data={chartData} options={options} />
            </div>

            </>
        )

    }

}

export default ScatterPlot;