import React, { Component } from 'react';
import '../Css/sign-up.css';
import axios from '../axios';
import Navbar from './NavBar';


// Đây là component hiển thị SignUp Form
class SignUp extends Component {
    state = {
        username: '',
        password: '',
        passwordcf: '',
        name: '',
        phone: '',
        address: '',
        code: '',
        adminRegistering: false
    }

    // Thay đổi state theo nội dung người dùng nhập vào form
    handleChange = (event) => {
        let target = event.target;
        // Nếu là form input dạng ô chọn thì sẽ set hasAgreed = target.checked(true | false) thay vì target.value
        let value = target.type === 'checkbox' ?
            target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    // Gửi request đăng ký user cho backend
    handleSubmit = (event) => {
        event.preventDefault();
        this.state.password === this.state.passwordcf ?
            axios
                .post('/customer/register', {
                    username: this.state.username,
                    password: this.state.password,
                    name: this.state.name,
                    address: this.state.address,
                    phone: this.state.phone,
                    code: this.state.code
                })
                .then(data => {
                    console.log('The form was submitted with the following data:');
                    console.log(data.data);
                    alert("Đăng ký thành công");
                    // Sau khi đăng ký thành công 1s thì tự động chuyển sang trang đăng nhập
                    setTimeout(function () { window.location.href = '/signin'; }, 1000);
                })
                .catch(err => {
                    alert("Đăng ký thất bại")
                    console.log(err)
                })
            : alert("Mật khẩu nhập lại không đúng")
        // console.log(this.state);
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="signup">
                    <div className="signup-bottom">
                        <div className="sign-up-header">Đăng ký tài khoản</div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Tên đăng nhập</label>
                                <input type="text" className="form-control" placeholder="Nhập tên đăng nhập" id="username" name="username" value={this.state.username} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Mật khẩu</label>
                                <input type="password" className="form-control" placeholder="Nhập mật khẩu" id="password" name="password" value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Xác nhận mật khẩu</label>
                                <input type="password" className="form-control" placeholder="Xác nhận mật khẩu" id="passwordcf" name="passwordcf" value={this.state.passwordcf} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Tên khách hàng</label>
                                <input type="text" className="form-control" placeholder="Nhập tên đầy đủ" id="name" name="name" value={this.state.name} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Điện thoại</label>
                                <input type="text" className="form-control" placeholder="Nhập số điện thoại" id="phone" name="phone" value={this.state.phone} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Địa chỉ</label>
                                <input type="text" className="form-control" placeholder="Nhập địa chỉ" id="address" name="address" value={this.state.address} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="gridCheck" id="adminRegistering" name="adminRegistering" value={this.state.adminRegistering} onChange={this.handleChange} />
                                    <label className="form-check-label" htmlFor="gridCheck">
                                        Đăng ký với tư cách quản trị viên
                                    </label>
                                </div>
                            </div>
                            {this.state.adminRegistering ? (
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Nhập mã quản trị" id="code" name="code" value={this.state.code} onChange={this.handleChange} />
                                </div>
                            ) : ""}
                            <button type="submit" className="btn btn-primary">Đăng ký</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;