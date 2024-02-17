import React, { Component } from "react";

import Papa from "papaparse";
import ReactPaginate from 'react-paginate';

import * as d3 from 'd3';
import { BarChart } from './BarChart';
import { HistogramChart } from './HistogramChart';
import { PieChart } from './PieChart';
import { HeatMap } from './HeatMap';



export class ReadCSV extends Component{

    constructor(props){

        super(props);

        this.state = {
            parsedData: [],
            tableRows: [],
            values: [],

            count: [],

            currentPage: 0,
            dataPerPage: 10,

            missingValues: [],
            missingValuesCount: {},

            histogramData: {},
            histogramFeatureIndex: 0,
            showHistogram: false,

            numericalStats: {},
            categoricalFeatures: {},

            correlationMatrix: [],

        };

        this.changeHandler = this.changeHandler.bind(this);  // Bind the changeHandler method

    }


    changeHandler = (event)=>{
        // console.log(event.target.files[0])
      
        Papa.parse(event.target.files[0],{
      
          header: true, 
          skipEmptyLines: false, 

          complete: function(results){
            // console.log(results.data)
    
            const rowsArray = [];
            const valuesArray = [];
            const missingValues = [];
            const numericalFeatures = {};
            const categoricalFeatures = {};
    
            // Iterating data to get column name and their values
            results.data.map((d) => {
                const rowValues = Object.values(d);
                rowsArray.push(Object.keys(d));
                valuesArray.push(rowValues);

                rowValues.forEach((val, index) => {
                    const featureName = rowsArray[0][index];
                    if (val === null || val === undefined || val === '') {
                        missingValues.push({ feature: featureName, value: val });
                    } else {
                        if (!isNaN(val)) {
                            if (!numericalFeatures[featureName]) {
                                numericalFeatures[featureName] = [];
                            }
                            numericalFeatures[featureName].push(parseFloat(val));
                        } else {
                            if (!categoricalFeatures[featureName]) {
                                categoricalFeatures[featureName] = new Set();
                            }
                            categoricalFeatures[featureName].add(val);
                        }
                    }
                });
            });

            const numericalStats = {};
            Object.entries(numericalFeatures).forEach(([feature, values]) => {
                const count = values.length;
                const mean = d3.mean(values);
                const std = d3.deviation(values);
                const min = d3.min(values);
                const max = d3.max(values);
                const sortedValues = values.sort((a, b) => a - b);
                const median = d3.median(sortedValues);
                const q1 = sortedValues[Math.floor((sortedValues.length - 1) / 4)];
                const q3 = sortedValues[Math.ceil((sortedValues.length - 1) * 3 / 4)];

                numericalStats[feature] = {
                    count,
                    mean,
                    std,
                    min,
                    median,
                    firstQuartile: q1,
                    thirdQuartile: q3,
                    max,
                };
            });

            const correlationMatrix = this.calculateCorrelationMatrix(numericalFeatures);
            

            // Calculating missing value percentage
            const totalRows = valuesArray.length;
            const missingValuesCount = {};
            missingValues.map((mv) => {
                missingValuesCount[mv.feature] = (missingValuesCount[mv.feature] || 0) + 1;
            });
            const missingValuesPercentage = {};
            Object.keys(missingValuesCount).map((feature) => {
                missingValuesPercentage[feature] = (missingValuesCount[feature] / totalRows) * 100;
            });

            
            
            this.setState({
                parsedData: results.data,
                tableRows: rowsArray[0],
                values: valuesArray,
                missingValues: missingValues,
                missingValuesPercentage: missingValuesPercentage,
                numericalStats: numericalStats,
                categoricalFeatures: categoricalFeatures,
                correlationMatrix: correlationMatrix,
            });


          }.bind(this),

        });
      };
    

    // Function to calculate correlation matrix
    calculateCorrelationMatrix = (numericalFeatures) => {
        const features = Object.keys(numericalFeatures);
        const correlationMatrix = [];

        for (let i = 0; i < features.length; i++) {
            const row = [];
            for (let j = 0; j < features.length; j++) {
                const feature1 = features[i];
                const feature2 = features[j];
                const correlation = this.calculateCorrelation(numericalFeatures[feature1], numericalFeatures[feature2]);
                row.push(correlation);
            }
            correlationMatrix.push(row);
        }

        return correlationMatrix;
    };

    // Function to calcualte correlation coefficient
    calculateCorrelation = (values1, values2) => {
        const n = values1.length;
        const sumX = d3.sum(values1);
        const sumY = d3.sum(values2);
        const sumXSq = d3.sum(values1.map(x => Math.pow(x, 2)));
        const sumYSq = d3.sum(values2.map(y => Math.pow(y, 2)));
        const sumXY = d3.sum(values1.map((x, i) => x * values2[i]));

        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = Math.sqrt((n * sumXSq - Math.pow(sumX, 2)) * (n * sumYSq - Math.pow(sumY, 2)));

        if (denominator === 0) {
            return 0; // Correlation is 0 if denominator is 0
        }

        return numerator / denominator;
    };


    

    handlePageClick = ({selected}) => {
        this.setState({
            currentPage: selected,
        });
    };

    handleHistogramIndexChange = (event) => {
        const newIndex = parseInt(event.target.value, 10);
        if(!isNaN(newIndex)){
            this.setState({
                histogramFeatureIndex: newIndex,
            });
        }
    };

    handleShowHistogram = () => {
        this.setState({
            showHistogram: true,
        });
    };
   

    render(){

        const { tableRows, values, currentPage, dataPerPage, missingValuesPercentage} = this.state;
        const startIndex = currentPage * dataPerPage;
        const endIndex = startIndex + dataPerPage;
        const currentValues = values.slice(startIndex, endIndex);

        
        return(
            <>
                {/* File Uploader */}
                <input type="file" name="file" accept='.csv' className="form-control form-control-sm" id="formFileSm" onChange={this.changeHandler}></input>
                <br/>
                <br/>

                {/* Table */}
                <table>
                    <thead>
                        <tr>
                            {
                                this.state.tableRows.map((rows, index) => {
                                    return <th key={index}>{rows}</th>
                                })
                            }
                        </tr>
                    </thead>

                    <tbody>


                        {
                            currentValues.map((value, index) => {
                                return(
                                    <tr key={index}>
                                        {value.map((val,i) => {
                                            return <td key={i}>{val}</td>
                                        })}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>

                 {/* Render the ReactPaginate component */}
                 <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil(values.length / dataPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />

                <p>The total number of features:{this.state.tableRows.length} and the total number of rows:{this.state.values.length}</p>
                <br/>
                <br/>

                {/* Data Description */}
                <div>
                    <h3>Numerical Feature Descriptions:</h3>
                    {Object.entries(this.state.numericalStats).map(([feature, stats]) => (
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
                <br/>
                <br/>
                {/* <DataDescription tableRows={tableRows} values={values}/> */}

                
                {/* Bar Chart */}
                <BarChart missingValuesPercentage={missingValuesPercentage}/>
                <br/>
                <br/>


                {/* Histogram chart */}
                <label>
                    Enter the index for the histogram data:
                    <input
                        type="number"
                        value={this.state.histogramFeatureIndex}
                        onChange={this.handleHistogramIndexChange}
                    />
                </label>

                <button onClick={this.handleShowHistogram}>Press to show Histogram</button>
                
                {this.state.showHistogram && (
                <HistogramChart
                    featureData={this.state.values.map((row) => row[this.state.histogramFeatureIndex])}
                    featureName={this.state.tableRows[this.state.histogramFeatureIndex]}
                />
                )}

                <br/>
                <br/>   

                {/* Pie Chart */}
                { this.state.categoricalFeatures && this.state.numericalStats && (
                        <PieChart 
                            categoricalFeatures= {this.state.categoricalFeatures}
                            numericalFeatures = {this.state.numericalStats} 
                        />
                    )
                }
                <br/>
                <br/>

               {/* Correlation Matrix */}
               {/* <div>
                    <h3>Correlation Matrix:</h3>
                    <table>
                        <thead>
                            <tr>
                                {tableRows.map((feature, index) => (
                                    <th key={index}>{feature}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.correlationMatrix.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((correlation, colIndex) => (
                                        <td key={colIndex}>{correlation.toFixed(2)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}

                <HeatMap numericalStats = {this.state.numericalStats}  correlationMatrix = {this.state.correlationMatrix} />

                <br/>
                <br/>


            </>
            
        );
    }
}


export default ReadCSV;