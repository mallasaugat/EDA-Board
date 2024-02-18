import React, { Component } from "react";

import Papa from "papaparse";
import ReactPaginate from 'react-paginate';

import * as d3 from 'd3';

import { DataDescription } from "./DataDescription";
import { BarChart } from './BarChart';
import { HistogramChart } from './HistogramChart';
import { PieChart } from './PieChart';
import { HeatMap } from './HeatMap';

import Dropdown from 'react-bootstrap/Dropdown';



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

            numericalStats: {},
            numericalFeatures: {},
            categoricalFeatures: {},

            selectedOption: null,

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
                numericalFeatures: numericalFeatures,
                categoricalFeatures: categoricalFeatures,
            });


          }.bind(this),

        });
      };
    

    handlePageClick = ({selected}) => {
        this.setState({
            currentPage: selected,
        });
    };



    handleDropdownChange = (eventKey) => {
        this.setState({ selectedOption: eventKey }); // eventKey is the dom attribute
    };

    renderVisualization = () => {
        const { selectedOption, missingValuesPercentage } = this.state;

        switch (selectedOption) {
            case "Data":
                return <DataDescription numericalStats={this.state.numericalStats} />;
            case "Pie":
                return <PieChart
                            categoricalFeatures={this.state.categoricalFeatures}
                            numericalFeatures={this.state.numericalStats}
                        />;
            case "Bar":
                return <BarChart missingValuesPercentage={missingValuesPercentage} />;
            case "Histogram":
                
                return <HistogramChart
                            values={this.state.values}
                            tableRows={this.state.tableRows}
                        />;
            case "Heat":
                return <HeatMap numericalFeatures={this.state.numericalFeatures}  />;
            default:
                return null;
        }
    };
   

    render(){

        const { tableRows, values, currentPage, dataPerPage} = this.state;
        const startIndex = currentPage * dataPerPage;
        const endIndex = startIndex + dataPerPage;
        const currentValues = values.slice(startIndex, endIndex);
        
        
        return(


            <div className="container mt-5" id="main">

                <h1 id="title">EDA Board</h1>

                {values.length > 0 || (<h4 id='info'>Upload dataset (csv format) and start the exploratory data analysis</h4>)}

                {/* File Uploader */}
                <input type="file" name="file" accept='.csv' className="form-control form-control-sm mb-3" id="formFileSm" onChange={this.changeHandler} />


                <div id='bd'>

                    {/* Table */}
                    <table className="table" id='table'>
                        <thead>
                            <tr>
                                {tableRows.map((rows, index) => (
                                    <th key={index}>{rows}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentValues.map((value, index) => (
                                <tr key={index}>
                                    {value.map((val, i) => (
                                        <td key={i}>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ReactPaginate */}
                    {values.length > 0 && (<ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        pageCount={Math.ceil(values.length / dataPerPage)} // Dynamically calculate pageCount
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={0}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination justify-content-center'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextLinkClassName={'page-link'}
                        id='paginate'
                    />)
                    }

                    

                    {values.length > 0 && (<p className="mt-3">The total number of features: {tableRows.length} and the total number of rows: {values.length}</p>)}

                    {/* Drop Down */}
                    {values.length > 0 && (
                        <Dropdown onSelect={this.handleDropdownChange}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Visualization
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Data">Data Description</Dropdown.Item>
                                <Dropdown.Item eventKey="Pie">Pie Chart</Dropdown.Item>
                                <Dropdown.Item eventKey="Bar">Count Plot</Dropdown.Item>
                                <Dropdown.Item eventKey="Histogram">Histogram</Dropdown.Item>
                                <Dropdown.Item eventKey="Heat">Correlation HeatMap</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                    <br/>
                    <br/>
                    {this.renderVisualization()}

                </div>

                

                
            </div>

            
        );
    }
}


export default ReadCSV;