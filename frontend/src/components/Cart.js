import React, { Component } from 'react';
import '../Css/cart.css';
import axios from '../axios';
import NavBar from './NavBar';

// Đây là component hiển thị giỏ hàng
class Cart extends Component {
    // state sẽ lưu trữ thông tin người dùng + thông tin giỏ hàng và giá tiền tổng cộng(total) các sản phẩm trong giỏ
    state = {
        // products: [],
        userInfo: [],
        cartInfo: [],
        total: 0
    }

    async UNSAFE_componentWillMount() {
        const username = localStorage.getItem('username');
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
            let total = 0;
            for (const item of cartData.data) {
                total += item.Price * item.Quantity
            }
            this.setState({
                userInfo: userData.data,
                cartInfo: cartData.data,
                total: total
            });

        } catch (err) {
            console.log(err.message);
        }
    }

    handleDeleteAll = async (e) => {
        e.preventDefault();
        var confirmMsg = window.confirm("Bạn muốn xóa tất cả sản phẩm trong giỏ hàng?")
        if (confirmMsg) {
            const username = localStorage.getItem('username');
            try {
                await axios.delete(`/cart/${username}`);
                this.setState({
                    cartInfo: [],
                    total: 0
                });
            } catch (err) {
                console.log(err);
            }
        }
    };

    // Xử lý đặt hàng, thêm tất cả các item trong giỏ hàng vào đơn hàng và gửi request tạo đơn hàng trong csdl
    handlePurchase = async (event) => {
        event.preventDefault();
        let orderList = [];
        for (const item of this.state.cartInfo) {
            const newItem = {
                productID: item.ProductID,
                quantity: item.Quantity
            };
            orderList.push(newItem);
        }
        console.log(orderList);
        // gửi request tạo đơn hàng cho backend xử lý với method POST
        try {
            const data = await fetch("http://localhost:5000/order", {
                method: "POST",
                // Dạng dữ liệu gửi cho backend là json
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                // nội dung dữ liệu gửi cho backend (total *1.05 là thêm tiền dịch vụ)
                body: JSON.stringify({
                    username: localStorage.getItem('username'),
                    orderList: orderList,
                    total: this.state.total * 1.05,
                    status: "Đặt hàng thành công"
                })
            }).then((res) => { return res.json(); });
            console.log(data)
            // Thông báo nếu tạo đơn hàng trong csdl thành công và ngược lại
            if (!data.success) {
                window.alert(data.message);
            } else {
                window.alert("Đặt hàng thành công!");
                window.location.href = '/order-list';
            }
        } catch (err) {
            this.setState({
                errMessage: err.message
            });
        }
    }

    // Xóa item khỏi giỏ hàng(cart) lưu trong csdl
    _Delete = (item, event) => {
        event.preventDefault();
        console.log("xoa no:", item);
        axios.delete('/cart', {
            data: {
                username: localStorage.getItem('username'),
                productID: item.ProductID
            }
        })
            .then(response => {
                console.log(response.data.success);
                // const i = this.state.cartInfo.indexOf(item);
                // if (i != -1) {
                //     this.setState({
                //         cartInfo: this.state.cartInfo.splice(i, 1)
                //     });
                // }
                // console.log(this.state.cartInfo);
                window.location.href = '/cart';
            })
            .catch(err => console.log(err))
    }

    // Decrease = (item,event) => {
    //     event.preventDefault();
    //     if(item.Quantity>1){
    //         item.Quantity--;
    //         this.setState({Total:0});
    //         this.props.state.Total-=item.Price;
    //     }
    //     axios.put('/cart',{
    //         quantity:item.Quantity-1,
    //         username:localStorage.getItem('username'),
    //         productID:item.productID
    //     })
    //     .then(response => {
    //         console.log(response.data.success)
    //       })
    //     .catch(err => console.log(err));
    // }

    // Increment = (item,event) => {
    //     event.preventDefault(); 
    //     item.Quantity++;
    //     this.setState({Total:1})
    //     this.props.state.Total+=item.Price;
    // }

    render() {
        // lấy danh sách item trong giỏ hàng từ state và hiển thị lên giao diện
        const cartItems = this.state.cartInfo.map(item => (
            <div key={item.ProductID} className="cart-item">
                {/* <div className="cart-checkbox">
                    <input type="checkbox" />
                </div> */}
                <div className="cart-img">
                    <img src={`http://localhost:5000/image/products/${item.Image}`} alt={item.ProductID} />
                </div>
                <div className="cart-description">
                    <span>{item.Name}</span>
                </div>
                <div className="cart-price">
                    <span>{item.Price}</span>
                </div>
                <div className="cart-quantity">
                    {/* Tăng giảm số lượng các items ở trang Cart bằng các hàm Decrease và Increase nhận được từ props */}
                    <div className='quantity-sub'>
                        <button type="button" onClick={(event) => this.props.Decrease(item, event)} className="btn btn-dark" ><i className="fas fa-minus" href="/home"></i></button>
                        <input type="number" name="quantity" min="1" placeholder={item.Quantity} style={{ minWidth: "35px" }} disabled />
                        <button type="button" onClick={(event) => this.props.Increase(item, event)} className="btn btn-light"><i className="fas fa-plus"></i></button>
                    </div>
                </div>

                {/* Thực hiện xóa item từ giỏ hàng sử dụng hàm Delete ở trên */}
                <div className="cart-remove">
                    <div className="list-delete">
                        {/* <i className="fas fa-trash" onClick={(event) => { this._Delete(item, event) }}></i> */}
                        <button className="btn btn-danger" onClick={(event) => { this._Delete(item, event) }}>Xóa</button>
                    </div>
                </div>
            </div>
        ));
        return (
            <div>
                <NavBar products={this.props.state.products} handleSearch={this.props.handleSearch} Total={this.props.state.Total} count={this.props.state.count} />
                <div className="cartcontent">
                    <div className="cart-bottom">
                        <div className="cart-bottom-left">
                            <div className="cart-header mb-3">
                                <div className="row">
                                    <div className="col-10">
                                        Tất cả sản phẩm ({this.props.state.count})
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-danger"
                                            style={{
                                                // width: "100%",
                                                fontSize: "1rem",
                                                backgroundColor: "#e70029",
                                                display: 'flex',
                                                alignItems: 'center',
                                                float: 'right'
                                            }}
                                            onClick={this.handleDeleteAll}
                                        >
                                            <i class="fas fa-trash-alt" style={{ marginRight: "5px" }}></i>Huỷ
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="cart-bottom-left-top">
                                <div className="list-header" style={{ lineHeight: "3rem", height: "3rem" }}>
                                    <div className='header-product'>
                                        Sản phẩm
                                    </div>
                                    <div className='header-price'>
                                        Giá thành
                                    </div>
                                    <div className='header-quantity'>
                                        Số lượng
                                    </div>
                                    <div className='header-delete'></div>
                                </div>
                            </div>
                            {/* Hiển thị danh sách các item trong giỏ hàng bằng biến cartItems đã tạo ở trên */}
                            <div className="cart-bottom-left-bottom">
                                {cartItems}
                            </div>
                        </div>
                        <div className="cart-bottom-right mt-3">
                            <div className="product-location">
                                <div className="location-header">Địa chỉ giao hàng</div>
                                <div className="location-info-2">
                                    <div><i className="fas fa-user-check"></i>  Khách hàng: {this.state.userInfo.Name}</div>
                                    <div><i className="fas fa-map-marker"></i>  Địa chỉ: {this.state.userInfo.Address}</div>
                                    <div><i className="fas fa-mobile"></i>  Số điện thoại: {this.state.userInfo.Phone}</div>
                                </div>

                            </div>
                            <div className="cart-summary">
                                <div className="summary-header">
                                    Thông tin giỏ hàng
                                </div>
                                <div className="summary-content">
                                    <div className="sub-total">
                                        <div className="sub-total-left">
                                            Tạm tính:
                                        </div>
                                        <div className="sub-total-right">
                                            {this.props.state.Total}đ
                                        </div>
                                    </div>
                                    <div className="ship-fee">
                                        <div className="ship-fee-left">Phí vận chuyển:</div>
                                        <div className="ship-fee-right">{Math.round(this.props.state.Total / 20)}đ</div>
                                    </div>
                                </div>
                                {/* <div className="summary-voucher">
                                    <input type="text" className="voucher-use" placeholder="voucher" />
                                    <button className="voucher-apply btn btn-primary">Apply</button>
                                </div> */}
                                <div className="summary-total">
                                    <div className="summary-total-left">Tổng:</div>
                                    <div className="summary-total-right">
                                        <div>{Math.round(this.props.state.Total * 1.05)}đ</div>
                                        <div>(đã bao gồm VAT)</div>
                                    </div>
                                </div>
                                {/* Thực hiện tạo đơn hàng(order) sau khi người dùng xác nhận thanh toán bằng hàm handlePurchase ở trên */}
                                <div className="summary-confirm">
                                    <button className="btn btn-danger btn-block" onClick={(event) => { this.handlePurchase(event); }}>
                                        Thanh toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;