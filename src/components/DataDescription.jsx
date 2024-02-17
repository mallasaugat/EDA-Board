import React, {Component} from "react";

export class DataDescription extends Component{

    render(){

        const { numericalStats } = this.props;

        return(
            <div>
                    <h3>Numerical Feature Descriptions:</h3>
                    {Object.entries(numericalStats).map(([feature, stats]) => (
                        <div key={feature}>
                            <h4>{feature}</h4>
                            <ul>
                                <li>Count: {stats.count}</li>
                                <li>Mean: {stats.mean}</li>
                                <li>Standard Deviation: {stats.std}</li>
                                <li>Minimum: {stats.min}</li>
                                <li>25th Percentile (First Quartile): {stats.firstQuartile}</li>
                                <li>Median: {stats.median}</li>
                                <li>75th Percentile (Third Quartile): {stats.thirdQuartile}</li>
                                <li>Maximum: {stats.max}</li>
                            </ul>
                        </div>
                    ))}
            </div>
        )

    }

}

export default DataDescription;