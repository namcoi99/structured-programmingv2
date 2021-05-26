import React, { Component } from "react";

export default class PaginationBar extends Component {
    render() {
        const {
            activePage, totalPages, onPageChange
        } = this.props
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    {/* <li className="page-item disabled">
                        <a className="page-link" tabIndex="-1">Previous</a>
                    </li> */}
                    {
                        [...new Array(totalPages)].map((fake, idx) => (
                            <li key={"page-bar" + idx} 
                                className={`page-item ${idx+1 === activePage ? "active" : ""}`}
                                onClick={() => onPageChange(idx+1)}>
                                <a className="page-link">
                                    {idx+1}
                                </a>
                            </li>
                        ))
                    }
                    {/* <li className="page-item">
                        <a className="page-link" >Next</a>
                    </li> */}
                </ul>
            </nav>
        )
    }
}