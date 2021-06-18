import React, { Component } from 'react';
import '../Css/header.css';
import axios from '../axios';

// Đây là component hiển thị navigation bar(thanh điều hướng)
class NavBar extends Component {

    state = {
        products: [],
        orders: [],
        productSearch: '',
        orderSearch: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'productSearch') {
            if (event.target.value !== '') {
                axios.get(`/product?pageNumber=1&pageSize=4&keyword=${event.target.value}`)
                    .then(data => {
                        this.setState({
                            products: data.data.data.recordset
                        })
                    })
                    .catch(err => console.log(err))
            } else {
                this.setState({ products: [] })
            }
        } else if (event.target.name === 'orderSearch') {

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.orderSearch !== '') {
            window.location.href = `/order-detail/${this.state.orderSearch}`
        }
    }

    // Đăng xuất người dùng
    SignOut = () => {
        // Xóa tên và giỏ hàng khỏi localStorage
        localStorage.removeItem("username")
        localStorage.removeItem("admin")
        localStorage.removeItem('cart')
        this.props.username = null
        // reload lại trang
        window.location.href = '/'
    }

    // Gửi request lấy dữ liệu của những sản phẩm bán chạy nhất tới backend
    componentDidMount() {
        axios.get(`/product/best-seller`)
            .then(data => {
                // lưu dữ liệu lấy được vào state
                this.setState({
                    products: data.data.data.recordset
                })
            })
            .catch(err => console.log(err));
    }

    viewCart = (event) => {
        event.preventDefault();
        const username = localStorage.getItem('username');
        if (username) {
            window.location.href = '/cart';
        }
        else {
            alert('You must log in first');
        }
    }

    viewOrder = (event) => {
        event.preventDefault();
        const username = localStorage.getItem('username');
        if (username) {
            window.location.href = '/order-list';
        }
        else {
            alert('You must log in first');
        }
    }

    render() {
        const prefix = this.state.products ? this.state.products.map(item => (
            <a className='search-1' key={item.ProductID} href={`/product/${item.ProductID}`}>
                <div className='result-item' key={item.ProductID}>
                    {item.Name.toString().toLowerCase()}
                </div>
            </a>
        )) : ''
        // const displayItems = this.props.products ? this.props.products.map(item => (
        //     <div className="list-item-left">
        //         <a key={item.ProductID} href={`/product/${item.ProductID}`}>
        //             <div key={item.ProductID} className="list-item-right">
        //                 <i className="fas fa-times" area-hidden="true"></i>
        //                 <img src={`http://localhost:5000/image/products/${item.Image}.jpg`} alt={item.Name} />
        //                 <div className="content-item-order">
        //                     <h3>{item.Name}</h3>
        //                     <p>{item.Price}đ*{item.Quantity}</p>
        //                 </div>
        //             </div>
        //         </a>
        //     </div>
        // )) : ''

        // Lấy tên người dùng từ localStorage
        var username = localStorage.getItem('username')
        var checkAdmin = localStorage.getItem('admin') === 'true'
        let SignIn, SignUp, LogOut
        // Nếu chưa đăng nhập thì hiển thị nút đăng ký và đăng nhập, ngược lại thì hiển thị "Chào mừng" + tên người dùng
        if (username == null) {
            // Hiển thị nút đăng nhập nếu người dùng chưa login
            SignIn = (
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="signinDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Đăng nhập</a>
                    <div className="dropdown-menu" aria-labelledby="signinDropdown">
                        <a className="dropdown-item" href='/signin'>User</a>
                        <a className="dropdown-item" href='/'>Admin</a>
                    </div>
                </li>

            )
        } else {
            // Hiển thị "Chào mừng" + tên người dùng nếu người dùng đã login
            SignIn = (
                <li className="nav-item">
                    {/* <div className="nav-link text-white">Chào mừng, {username} </div> */}
                    <a className="nav-link text-white" href={checkAdmin ? "/admin": null}>Chào mừng, {username} </a>
                </li>
            )
        }
        // Hiển thị nút đăng ký nếu người dùng chưa đăng nhập
        if (username == null)
            SignUp = (
                <li className="nav-item">
                    <a className="nav-link" href="/signup">Đăng ký</a>
                </li>
            )
        // Hiển thị nút logout nếu người dùng đã đăng nhập
        if (username != null)
            LogOut = (
                <li className="nav-item">
                    <a className="nav-link" href='/' onClick={this.SignOut}>Đăng xuất</a>
                </li>
            )
        return (
            // Thanh điều hướng
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/"><i className="fas fa-frog" style={{ fontSize: "2rem" }}></i> <b style={{ fontSize: "1.5rem" }}>STREETWEAR</b></a>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Trang chủ <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Sản phẩm
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href='/Shirt'>Áo</a>
                                <a className="dropdown-item" href='/Pants'>Quần</a>
                                <a className="dropdown-item" href='/Bag'>Phụ kiện</a>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={this.viewCart}>Giỏ hàng</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={this.viewOrder}>Đơn hàng</a>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0" style={{ position: "relative" }}>
                        <input className="form-control mr-sm-2" type="search" placeholder="Tìm kiếm sản phẩm..."
                            name="productSearch" id="productSearch" onChange={this.handleChange} />
                        <div className='search-container-1'>{prefix}</div>
                        <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit" onClick={(e) => this.handleSubmit(e)}>Tìm kiếm</button>

                    </form>
                    <ul className="navbar-nav ml-2">
                        {SignUp}
                        {SignIn}
                        {LogOut}
                    </ul>
                </div>
            </nav>
        );
    }
}

export default NavBar;