import React, { useEffect, useState } from 'react';

export default function OrderDetailModal(props) {
    const [item, setItem] = useState(props.item);
    const [user, setUser] = useState();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (item.OrderID) {
            getOrderData(item.OrderID);
        } else {
            getCartData(item.Username);
        }
    }, [item]);

    const getOrderData = async (orderID) => {
        try {
            const data = await fetch(`http://localhost:5000/order/${orderID}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            ).then((res) => { return res.json(); });
            // console.log(data.data);

            setTotal(data.data.detail.Total / 1.05);
            setUser({
                Name: data.data.detail.Name,
                Address: data.data.detail.Address,
                Phone: data.data.detail.Phone
            });
            setProducts(data.data.orderList);
        } catch (err) {
            console.log(err.message);
        }
    };

    const getCartData = async (username) => {
        try {
            const userData = await fetch(`http://localhost:5000/customer/info/${username}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            ).then((res) => { return res.json(); });
            console.log(userData.data);
            const cartData = await fetch(`http://localhost:5000/cart/${username}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            ).then((res) => { return res.json(); });
            console.log(cartData.data);
            let totalPaid = 0;
            for (const item of cartData.data) {
                totalPaid += item.Price * item.Quantity
            }
            setTotal(totalPaid);
            setUser(userData.data);
            setProducts(cartData.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    const all_items = products.map(item =>
        <tr className="mt-3">
            <th scope="row" style={{ width: "5%" }}>{item.ProductID}</th>
            <td style={{ width: "15%" }}>
                <img src={`http://localhost:5000/image/products/${item.Image}`} className="img-fluid img-thumbnail" alt="Product Image"
                    style={{
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeate',
                        height: '100px',
                        width: '100px'
                    }} />
            </td>
            <td style={{ width: "25%" }}>{item.Name}</td>
            <td style={{ width: "15%" }}>{item.Price} VND</td>
            <td style={{ width: "10%" }}>{item.Quantity}</td>
            <td style={{ width: "15%", fontWeight: "bold" }}>{item.Price * item.Quantity} VND</td>
        </tr>
    )

    return (
        <div>
            {/* Modal */}
            <div className="modal fade add-modal" id={`viewModal${item.OrderID ? item.OrderID : item.Username}`} role="dialog" aria-labelledby="viewModalTitle" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{ maxWidth: "80vw" }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: "#17a2b8", color: "white" }}>
                            <h5 className="modal-title" id="viewModalTitle">
                                <i className="fa fa-info-circle mr-3"></i> Thông tin đơn hàng</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">X</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="card card-employee card-margin">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-6">
                                                Khách hàng:
                                            </div>
                                            <div className="col-6" style={{ color: "gray" }}>
                                                {user ? user.Name : ''}
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-6">
                                                Địa chỉ:
                                            </div>
                                            <div className="col-6" style={{ color: "gray" }}>
                                                {user ? user.Address : ''}
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-6">
                                                Số điện thoại:
                                            </div>
                                            <div className="col-6" style={{ color: "gray" }}>
                                                {user ? user.Phone : ''}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="card card-employee card-margin">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table widget-26">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th scope="col">ID</th>
                                                        <th scope="col">Ảnh</th>
                                                        <th scope="col">Tên sản phẩm</th>
                                                        <th scope="col">Giá</th>
                                                        <th scope="col">Số lượng</th>
                                                        <th scope="col">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <div className="mb-3"></div>
                                                    {all_items}
                                                    <tr><td colSpan="6"><hr></hr></td></tr>
                                                    <tr style={{ color: "gray" }}>
                                                        <td colspan="5">Phí vận chuyển: </td>
                                                        <td>{Math.round(total / 20)} VND</td>
                                                    </tr>
                                                    <tr className="mt-3" style={{ color: "red", fontWeight: "bold" }}>
                                                        <td colspan="5">Tổng cộng:</td>
                                                        <td>{Math.round(total * 1.05)} VND</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
