import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../Css/order-table.css';
const AdminOrderList = () => {

    const [orders, setOrders] = useState([])
    const [currentPage, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(5)
    // const [fakeOrders] = useState([
    //     {
    //         OrderID: "Z19845",
    //         CreateDate: "2/7/2021",
    //         Username: "Lê Thanh Tùng",
    //         Total: 2000000,
    //         Status: "Thành công"
    //     },
    //     {
    //         OrderID: "Z19855",
    //         CreateDate: "3/9/2021",
    //         Username: "Lê Thanh Tùng",
    //         Total: 2999000,
    //         Status: "Chờ"
    //     },
    //     {
    //         OrderID: "Z19745",
    //         CreateDate: "23/12/2021",
    //         Username: "Lê Thanh Tùng",
    //         Total: 1999000,
    //         Status: "Hủy"
    //     }
    // ])

    useEffect(() => {
        const username = localStorage.getItem('username');
        async function fetchOrders(username) {
            try {
                const orderData = await axios.get(`/order?username=${username}`)
                console.log(orderData)
                const orderList = orderData.data.data.recordset
                console.log(orderList.length)
                // orderList.length !== 0 ? setOrders(orderList) : setOrders(fakeOrders)
                setOrders(orderList)
            } catch (err) {
                console.log(err)
            }
        }
        fetchOrders(username);
    }, [])

    const handleDeleteOrder = (orderID) => {
        var confirmMsg = window.confirm("Bạn có muốn xóa đơn hàng?")
        if (confirmMsg) {
            axios
                .delete(`/order/${orderID}`)
                .then(data => {
                    console.log(data.data);
                    if (data.data.success) {
                        alert("Xóa đơn hàng thành công");
                        window.location.reload();
                    } else {
                        window.alert(data.data.message)
                    }
                })
                .catch(err => alert(err.message))
        }
    }

    const nextPage = () => {

    }

    const prevPage = () => {

    }

    const orderList = orders ? orders.map(item => (
        <tr key={item.OrderID}>
            <th scope="row">{item.OrderID}</th>
            <td>{item.CreateDate.substr(0, 10)}</td>
            <td>{item.Username}</td>
            <td>{item.Total}đ</td>
            <td>{item.Status}</td>
            <td className="text-center">
                <a href={`/order-detail/${item.OrderID}`}>
                    <button type="button" className="btn btn-outline-primary btn-sm mr-2"><i className="fas fa-eye"></i></button>
                </a>
                <a onClick={() => handleDeleteOrder(item.OrderID)}>
                    <button type="button" className="btn btn-outline-danger btn-sm"><i className="fas fa-trash-alt"></i>
                    </button>
                </a>
            </td>
        </tr>
    )) : ""

    const orderTable = orders.length !== 0 ? (
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
        <div style={{ minHeight: "80vh" }}>
            <h1 className="text-center mt-5 font-weight-bold text-uppercase">Quản lý đơn hàng</h1>
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
    );
};

export default AdminOrderList;