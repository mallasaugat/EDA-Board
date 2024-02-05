import React, { Component } from "react";

import Papa from "papaparse";
import ReactPaginate from 'react-paginate';

import { BarChart } from './BarChart';
import { HistogramChart } from './HistogramChart';
import * as d3 from 'd3';



export class ReadCSV extends Component{

    constructor(props){

        super(props);

        this.state = {
            parsedData: [],
            tableRows: [],
            values: [],

            currentPage: 0,
            dataPerPage: 10,

            missingValues: [],
            missingValuesCount: {},

            histogramData: {},
            histogramFeatureIndex: 0,
            showHistogram: false,

            heatmapData: [],
            
        };

        this.changeHandler = this.changeHandler.bind(this);  // Bind the changeHandler method

    }

    renderHeatmap = () => {
        const { tableRows, heatmapData } = this.state;

        const svg = d3.select('#heatmap-container')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([d3.min(heatmapData), d3.max(heatmapData)]);

        svg.selectAll('.heatmap-row')
            .data(heatmapData)
            .enter()
            .append('g')
            .attr('class', 'heatmap-row')
            .selectAll('.heatmap-cell')
            .data(d => d)
            .enter()
            .append('rect')
            .attr('class', 'heatmap-cell')
            .attr('x', (d, i) => i * 50) // Adjust spacing based on your needs
            .attr('y', (d, i) => i * 20) // Adjust spacing based on your needs
            .attr('width', 50) // Adjust cell width based on your needs
            .attr('height', 20) // Adjust cell height based on your needs
            .attr('fill', d => colorScale(d));
    };

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
    
            // Iterating data to get column name and their values
            results.data.map((d) => {
                rowsArray.push(Object.keys(d));
                valuesArray.push(Object.values(d));

                // Check for null values
                const rowsValues = Object.values(d);
                rowsValues.map((val, index) =>{
                    if(val===null || val== undefined || val===''){
                        const featureName = rowsArray[0][index];
                        missingValues.push({feature: featureName, value: val});
                    }
                });
            });

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
            
            const heatmapFeatureIndex = 0;
            const heatmapData = [valuesArray.map(row => parseFloat(row[heatmapFeatureIndex]))];
            
            this.setState({
                parsedData: results.data,
                tableRows: rowsArray[0],
                values: valuesArray,
                missingValues: missingValues,
                missingValuesPercentage: missingValuesPercentage,
                heatmapData: heatmapData,
            });

            this.renderHeatmap(); //Call the heatmap rendering after setting state

          }.bind(this),

        });
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

        // Manual histogram index
        //const histogramFeatureIndex = 1; // Index of the feature to visualize
        //const histogramFeatureIndex = this.state.values.map((row) => row[histogramFeatureIndex]);

        
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

                
                {/* Bar Chart */}
                <BarChart missingValuesPercentage={missingValuesPercentage}/>

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

                {/* HeatMap */}
                {this.state.heatmapData.length > 0 && (
                    <div id="heatmap-container">
                        {/* Render the heatmap here */}
                        {this.renderHeatmap()}
                    </div>
                )}

              

            </>
            
        );
    }
}


export default ReadCSV;