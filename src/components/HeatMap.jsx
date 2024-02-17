import React, { Component } from "react";
import Plot from 'react-plotly.js';

export class HeatMap extends Component{
    render(){
        const { numericalFeatures, correlationMatrix } = this.props;

        // Prepare data for Plotly heatmap
        const data = [{
            z: correlationMatrix,
            x: numericalFeatures,
            y: numericalFeatures,
            type: 'heatmap'
        }];

        // Define layout for Plotly heatmap
        const layout = {
            title: 'Correlation Matrix Heatmap',
            xaxis: { title: 'Features' },
            yaxis: { title: 'Features' },
            autosize: true, // Automatically adjust size based on container size
            margin: {
                l: 50, // Adjust left margin
                r: 50, // Adjust right margin
                b: 100, // Adjust bottom margin
                t: 100, // Adjust top margin
                pad: 4 // Adjust padding
            }
        };

        return (
            <div style={{ width: '100%', height: '500px' }}>
                <h3>Correlation Matrix Heatmap:</h3>
                <Plot
                    data={data}
                    layout={layout}
                />
            </div>
        );
    }
}

export default HeatMap;