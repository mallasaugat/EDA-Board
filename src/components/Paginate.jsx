import React from "react";


const Paginate = ({ dataPerPage, totalData }) => {

    const pageNumbers = [];

    for(let i=1; i<=Math.ceil(totalData/dataPerPage); i++){
        pageNumbers.push(i);
    }

    return(
        <div className="pagination-container">
            <ul className="pagination">
                {pageNumbers.map((number) => {
                    <li key={number} onClick={()=>paginate(number)} className="page-number">
                        {number}
                    </li>
                })}
            </ul>
        </div>
    );

};

export default Paginate;