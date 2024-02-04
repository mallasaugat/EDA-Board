import React, { Component } from 'react';
import Papa from "papaparse";
import ReactPaginate from 'react-paginate';



export class ReadCSV extends Component{

    constructor(props){

        super(props);

        this.state = {
            parsedData: [],
            tableRows: [],
            values: [],

            currentPage: 0,
            dataPerPage: 10,

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
    
            // Iterating data to get column name and their values
            results.data.map((d) => {
                rowsArray.push(Object.keys(d));
                valuesArray.push(Object.values(d));
            });
    
            
            this.setState({
                parsedData: results.data,
                tableRows: rowsArray[0],
                values: valuesArray,
            });
          }.bind(this),
        });
      };

    handlePageClick = ({selected}) => {
        this.setState({
            currentPage: selected,
        });
    }

    render(){

        const { tableRows, values, currentPage, dataPerPage } = this.state;
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

                        {/* {
                            this.state.values.map((value, index) => {
                            return (
                                <tr key={index}>
                                    {value.map((val, i) => {
                                    return <td key={i}>{val}</td>;
                                    })}
                                </tr>
                            );
                        })} */}

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
            </>
        );
    }
}


export default ReadCSV;