import React, { useEffect, useState } from 'react';
import '../Css/order-table.css';
const OrderTable = () => {

    const [orders, setOrders] = useState([])
    const [currentPage, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(5)

    useEffect(() => {
        setOrders([
            {
                id: "Z19845",
                date: "2/7/2021",
                name: "Lê Thanh Tùng",
                total: 2000000,
                status: "Thành công"
            },
            {
                id: "Z19855",
                date: "3/9/2021",
                name: "Lê Thanh Tùng",
                total: 2999000,
                status: "Chờ"
            },
            {
                id: "Z19745",
                date: "23/12/2021",
                name: "Lê Thanh Tùng",
                total: 1999000,
                status: "Hủy"
            }
        ])
    })

    const nextPage = () => {

    }

    const prevPage = () => {

    }

    const orderList = orders.map(item => (
        <tr>
            <th scope="row">{item.id}</th>
            <td>{item.date}</td>
            <td>{item.name}</td>
            <td>{item.total}đ</td>
            <td>{item.status}</td>
            <td className="text-center">
                <a href=""><i className="order__edit-icon fas fa-eye"></i></a>
                <a href=""><i className="order__delete-icon fas fa-trash-alt"></i></a>
            </td>
        </tr>
    ))

    return (
        <div className="order__table">
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
            <nav aria-label="">
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                        <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">Previous</a>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default OrderTable;