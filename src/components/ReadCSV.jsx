import React, { useState } from "react";
import Papa from "papaparse";
import ReactPaginate from 'react-paginate';
import * as d3 from 'd3';
import DataDescription from "./DataDescription";
import BarChart from './BarChart';
import HistogramChart from './HistogramChart';
import PieChart from './PieChart';
import HeatMap from './HeatMap';
import Dropdown from 'react-bootstrap/Dropdown';

function ReadCSV() {
    const [parsedData, setParsedData] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [values, setValues] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [missingValues, setMissingValues] = useState([]);
    const [numericalStats, setNumericalStats] = useState({});
    const [numericalFeatures, setNumericalFeatures] = useState({});
    const [categoricalFeatures, setCategoricalFeatures] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [dataPerPage] = useState(10);
    const [missingValuesPercentage, setMissingValuesPercentage] = useState({});

    const changeHandler = (event) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: false,
            complete: function(results) {
                const rowsArray = [];
                const valuesArray = [];
                const missingValues = [];
                const numericalFeatures = {};
                const categoricalFeatures = {};
                results.data.forEach((d) => {
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

                const totalRows = valuesArray.length;
                const missingValuesCount = {};
                missingValues.forEach((mv) => {
                    missingValuesCount[mv.feature] = (missingValuesCount[mv.feature] || 0) + 1;
                });
                const missingValuesPercentage = {};
                Object.keys(missingValuesCount).forEach((feature) => {
                    missingValuesPercentage[feature] = (missingValuesCount[feature] / totalRows) * 100;
                });

                setParsedData(results.data);
                setTableRows(rowsArray[0]);
                setValues(valuesArray);
                setMissingValues(missingValues);
                setMissingValuesPercentage(missingValuesPercentage);
                setNumericalStats(numericalStats);
                setNumericalFeatures(numericalFeatures);
                setCategoricalFeatures(categoricalFeatures);
            },
        });
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleDropdownChange = (eventKey) => {
        setSelectedOption(eventKey);
    };

    const renderVisualization = () => {
        switch (selectedOption) {
            case "Data":
                return <DataDescription numericalStats={numericalStats} />;
            case "Pie":
                return <PieChart categoricalFeatures={categoricalFeatures} numericalFeatures={numericalStats} />;
            case "Bar":
                return <BarChart missingValuesPercentage={missingValuesPercentage} />;
            case "Histogram":
                return <HistogramChart values={values} tableRows={tableRows} />;
            case "Heat":
                return <HeatMap numericalFeatures={numericalFeatures} />;
            default:
                return null;
        }
    };

    const startIndex = currentPage * dataPerPage;
    const endIndex = startIndex + dataPerPage;
    const currentValues = values.slice(startIndex, endIndex);

    return (
        <div className="container mt-5" id="main">
            <h1 id="title">EDA Board</h1>
            {values.length > 0 || <h4 id='info'>Upload dataset (csv format) and start the exploratory data analysis</h4>}
            <input type="file" name="file" accept='.csv' className="form-control form-control-sm mb-3" id="formFileSm" onChange={changeHandler} />
            <div id='bd'>
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
                {values.length > 0 && (
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        pageCount={Math.ceil(values.length / dataPerPage)}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={0}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination justify-content-center'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextLinkClassName={'page-link'}
                        id='paginate'
                    />
                )}
                {values.length > 0 && (
                    <p className="mt-3">The total number of features: {tableRows.length} and the total number of rows: {values.length}</p>
                )}
                {values.length > 0 && (
                    <Dropdown onSelect={handleDropdownChange}>
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
                <br />
                <br />
                {renderVisualization()}
            </div>
        </div>
    );
}

export default ReadCSV;

