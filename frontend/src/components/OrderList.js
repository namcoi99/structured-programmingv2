import React, { Component } from 'react';
import axios from '../axios';
import '../Css/order-list.css';
import Navbar from './NavBar';

// Đây là trang hiển thị tất cả đơn hàng của người dùng theo dạng danh sách
class Order extends Component {
    constructor(props) {
        super(props)

        this.state = {
            orderDetails: [],
            total: 0
        }
    }

    UNSAFE_componentWillMount() {
        this.getData()
    }

    getData = async () => {
        const username = localStorage.getItem('username');
        try {
            const data = await fetch(`http://localhost:5000/order?username=${username}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            ).then((res) => { return res.json(); });
            console.log(data.data);
            this.setState({
                orderDetails: data.data.recordset,
                total: data.data.total
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    handleCancelOrder = (orderID) => {
        var confirmMsg = window.confirm("Bạn có thực sự muốn hủy đơn hàng?")
        if (confirmMsg) {
            axios.put("/order", {
                orderID: orderID,
                status: "Đã hủy"
            }).then(res => {
                console.log(res)
                this.getData()
            }).catch(err => {
                console.log(err)
            })
        }
    }

    render() {

        const orderList = this.state.orderDetails.map(item => (
            <tr key={item.OrderID}>
                <th scope="row">{item.OrderID}</th>
                <td>{item.CreateDate.substr(0, 10)}</td>
                <td>{item.Username}</td>
                <td>{item.Total}đ</td>
                <td>{item.Status}</td>
                <td className="text-right">
                    {item.Status !== "Đã hủy" ? (
                        <button className="btn btn-danger" onClick={() => this.handleCancelOrder(item.OrderID)}>Hủy đơn hàng</button>
                    ) : ""}
                </td>
            </tr>
        ))

        const orderTable = this.state.orderDetails.length !== 0 ? (
            <table className="table table-light">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Mã đơn hàng</th>
                        <th scope="col">Ngày đặt hàng</th>
                        <th scope="col">Khách hàng</th>
                        <th scope="col">Tổng giá trị</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {orderList}
                </tbody>
            </table>
        ) : <div>Không có đơn hàng nào để hiển thị.</div>

        return (
            <div>
                <Navbar products={this.props.state.products} handleSearch={this.props.handleSearch} Total={this.props.state.Total} count={this.props.state.count} />
                <div style={{ minHeight: "80vh" }}>
                    <h1 className="text-center mt-5 font-weight-bold text-uppercase">Các đơn hàng đã đặt</h1>
                    <div className="order__table">
                        {orderTable}
                    </div>
                    {/* Pagination */}
                    {/* <nav className="d-flex justify-content-center mb-4">
                <ul className="pagination pagination-base pagination-boxed pagination-square mb-0">
                    <li className={`page-item ${this.state.currentPageNumber === 1 ? 'disabled' : ''}`}
                        onClick={this.handlePrevClick}>
                        <a className="page-link no-border" href="#">
                            <span aria-hidden="true">«</span>
                            <span className="sr-only">Previous</span>
                        </a>
                    </li>
                    {paginations.map((item) => {
                        return (
                            <li className={`page-item ${item === this.state.currentPageNumber ? 'active' : ''}`}
                                key={item}
                                onClick={() => { this.handlePageChange(item) }}
                            >
                                <a className="page-link" href="#">{item}</a>
                            </li>
                        );
                    })}
                    <li className={`page-item ${this.state.currentPageNumber === this.state.maxPageNumber ? 'disabled' : ''}`}
                        onClick={this.handleNextClick}>
                        <a className="page-link no-border" href="#">
                            <span aria-hidden="true">»</span>
                            <span className="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
            </nav> */}
                    {/* End Pagination */}
                </div>
            </div>
        );
    }
}

export default Order;