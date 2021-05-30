import React, { Component } from 'react';
import '../Css/header.css';
import logo from '../Images/logo.png'
import pizza from '../pizaa-1.jpg';
import burger from '../hamburger-nav.png';
import milktea from '../milktea-nav.jpg';
import axios from '../axios';

// Đây là component hiển thị navigation bar(thanh điều hướng)
class NavBar extends Component {

    state = {
        products: [],
        orders: [],
        productSearch: '',
        orderSearch: ''
    }

    // Không sử dụng trong prj
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'productSearch') {
            if (event.target.value !== '') {
                axios.get(`/product/list?pageNumber=1&pageSize=4&keyword=${event.target.value}`)
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

    // Không sử dụng trong prj
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

    // Không sử dụng trong prj
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

    // Không sử dụng trong prj
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
        // Không sử dụng trong prj
        const prefix = this.state.products ? this.state.products.map(item => (
            <a className='search-1' key={item.ProductID} href={`/product/${item.ProductID}`}>
                <div className='result-item' key={item.ProductID}>
                    <h3>{item.Name.toString().toLowerCase()}</h3>
                </div>
            </a>
        )) : ''

        // Không sử dụng trong prj
        const displayItems = this.props.products ? this.props.products.map(item => (
            <div className="list-item-left">
                <a key={item.ProductID} href={`/product/${item.ProductID}`}>
                    <div key={item.ProductID} className="list-item-right">
                        <i className="fas fa-times" area-hidden="true"></i>
                        <img src={`http://localhost:5000/image/products/${item.Image}.png`} alt={item.Name} />
                        <div className="content-item-order">
                            <h3>{item.Name}</h3>
                            <p>{item.Price}đ*{item.Quantity}</p>
                        </div>
                    </div>
                </a>
            </div>
        )) : ''

        // Lấy tên người dùng từ local storage
        var username = localStorage.getItem('username')
        let SignIn
        let SignUp
        let LogOut
        let cartButton = null
        // Nếu chưa đăng nhập thì hiển thị nút đăng ký và đăng nhập, ngược lại thì hiển thị "Chào mừng" + tên người dùng
        if (username == null)
            // Hiển thị nút đăng nhập nếu người dùng chưa login
            SignIn = (
                <a href="/login">
                    <div className="sign-in">
                        <div className="sign-in-icon">
                            <i className="fas fa-sign-in-alt"></i>
                        </div>
                        <div className="sign-in-text">Đăng nhập</div>
                    </div>
                </a>
            )
        else {
            // Hiển thị "Chào mừng" + tên người dùng nếu người dùng đã login
            SignIn = (
                <div className="sign-in">
                    <div className="sign-up-icon">
                        <i className="far fa-user"></i>
                    </div>
                    <div className="sign-in-text">Chào mừng, {username}</div>
                </div>
            )
            cartButton = (
                <a className="nav-link" href="/cart">Giỏ hàng</a>
            )
        }
        // Hiển thị nút đăng ký nếu người dùng chưa đăng nhập
        if (username == null)
            SignUp = (
                <a href="/register">
                    <div className="sign-up">
                        <div className="sign-up-icon">
                            <i className="far fa-user"></i>
                        </div>
                        <div className="sign-up-text">Đăng ký</div>
                    </div>
                </a>
            )
        // Hiển thị nút logout nếu người dùng đã đăng nhập
        if (username != null)
            LogOut = (
                <a href='/' onClick={this.SignOut}>
                    <div className="sign-up">
                        <div className="sign-in-icon">
                            <i className="fas fa-sign-in-alt"></i>
                        </div>
                        <div className="sign-up-text">Đăng xuất</div>
                    </div>
                </a>
            )
        return (
            // Thanh điều hướng
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark navi-bar custom-nav-bar">
                <a className="navbar-brand" href="#"></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link home-page" href="/">Trang chủ</a>
                            {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
                        </li>

                    </ul>
                    <div className="form-inline my-2 my-lg-0">
                        {/* <a style={{marginRight: 5}} href="/register">Đăng ký</a>
                        <a href="/login">Đăng nhập</a> */}
                        {SignIn}
                        {SignUp}
                        {cartButton}
                        {LogOut}
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;