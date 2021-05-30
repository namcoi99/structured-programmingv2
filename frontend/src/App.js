import React, { Component } from 'react';
import axios from './axios.js';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './containers/Home';
import Product from './components/Product';
import Menu from './components/Menu';
import Cart from './components/Cart';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import ProductManagement from "./components/Admin/ProductManagement"
import Footer from '../src/components/Footer';
import OrderListSearch from './components/OrderListSearch.js';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const STATUS = {
  IDLE: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3,
}

class App extends Component {
  state = {
    status: STATUS.IDLE,
    products: [],
    count: 0,
    Total: 0
  }

  // Lấy ra giỏ hàng của người dùng
  componentDidMount() {
    axios.get(`/cart/${localStorage.getItem('username')}`)
      .then(data => {
        // Lưu các sản phẩm trong giỏ vào state
        this.setState({
          products: data.data.data
        })
        this.state.products.map(item => {
          // Tính tổng số lượng tiền các sản phẩm trong giỏ hàng và lưu vào state
          this.setState({
            Total: this.state.Total + item.Price * item.Quantity,
          })
          // Tính tổng số lượng sản phẩm mà người dùng có trong giỏ hàng
          this.setState({ count: this.state.count + item.Quantity })
        })
      })
      .catch(err => console.log(err))
  }

  // Gửi request login cho backend
  _onLogin = (username, password) => {
    axios.post('/customer/login', {
      username: username,
      password: password
    })
      .then(response => {
        if (response.data.success !== false) {
          // Lưu lại tên và id người dùng nếu login thành công
          this.setState({
            username: response.data.username,
            id: response.data.id
          })
          console.log(this.state)
          localStorage.setItem('username', response.data.username)
          console.log(response.data.username)
          window.location.href = '/';
        }
        // Hiển thị lỗi nếu login thất bại
        else {
          alert("Wrong username or password");
        }
      })
      .catch(err => console.log(err))
  }

  hideAlertDialog = () => {
    setTimeout(() => {
      this.setState({ status: STATUS.IDLE })
    }, 2000)
  }

  // Gửi request thêm mới sản phẩm vào giỏ hàng cho backend
  _addtoCart = (item, quantity, event) => {
    event.preventDefault();
    // Lấy ra tên người dùng hiện tại
    const username = localStorage.getItem('username');
    if (username) {
      this.setState({ status: STATUS.LOADING })
      // Gửi request cho backend
      axios.post('/cart/add', {
        username: username,
        productID: item.ProductID,
        quantity: quantity,
        name: item.Name,
        image: item.Image
      })
        .then(response => {
          this.setState({
            status: response.data.success
              ? STATUS.SUCCESS : STATUS.ERROR
          }, this.hideAlertDialog)
          console.log(response.data.success)
        })
        .catch(err => {
          console.log(err)
          this.setState({
            status: STATUS.ERROR
          }, this.hideAlertDialog)
        });
      // Cập nhật lại đơn hàng của người dùng
      axios.get(`/cart/${localStorage.getItem('username')}`)
        .then(data => {
          this.setState({
            products: data.data.data
          })
        })
        .catch(err => console.log(err));
      // Cập nhật lại tổng số lượng và tổng chi phí của cả giỏ hàng
      this.setState({
        count: this.state.count + quantity,
        Total: this.state.Total + item.Price * quantity
      })
    }
    else {
      alert('You must log in first');
    }
  }

  // Hàm này sử dụng để cập nhật số lượng và chi phí của giỏ hàng khi người dùng chọn giảm số lượng sản phẩm
  Decrease = (item, event) => {
    event.preventDefault();
    if (item.Quantity > 1) {
      item.Quantity--;
      this.setState({
        count: this.state.count - 1,
        Total: this.state.Total - item.Price
      });
      // Gửi request update lại giỏ hàng trong csdl
      axios.post('/cart/update', {
        quantity: item.Quantity,
        username: localStorage.getItem('username'),
        productID: item.ProductID
      })
        .then(response => {
          console.log(response.data.success)
        })
        .catch(err => console.log(err));
    }
  }

  // Tương tự Decrease
  Increase = (item, event) => {
    event.preventDefault();
    item.Quantity++;
    this.setState({
      count: this.state.count + 1,
      Total: this.state.Total + item.Price
    })
    this.setState({ Total: this.state.Total + item.Price });
    axios.post('/cart/update', {
      quantity: item.Quantity,
      username: localStorage.getItem('username'),
      productID: item.ProductID
    })
      .then(response => {
        console.log(response.data.success)
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        {/* Định tuyến url cho toàn bộ trang web. VD: khi truy cập vào đường dẫn / sẽ trả về trang Home */}
        <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/" render={(props) => {
                return <Home {...props} addtoCart={this._addtoCart} state={this.state} />
              }} />
              <Route exact path="/login" render={(props) => {
                return <SignIn {...props} state={this.state} _onLogin={this._onLogin} />
              }} />
              <Route exact path="/product/:productID" render={(props) => {
                return <Product {...props} addtoCart={this._addtoCart} state={this.state} />
              }} />
              <Route exact path="/register" render={(props) => {
                return <SignUp {...props} state={this.state} />
              }} />
              <Route exact path="/cart" render={(props) => {
                return <Cart {...props} Decrease={this.Decrease} Increase={this.Increase} state={this.state} />
              }} />
              <Route exact path="/order-list" render={(props) => {
                return <OrderList {...props} state={this.state} />
              }} />
              <Route exact path="/order-detail/:orderID" render={(props) => {
                return <OrderDetail {...props} state={this.state} />
              }} />
              <Route exact path="/menupizza" render={(props) => {
                return <Menu {...props} addtoCart={this._addtoCart} state={this.state} category={"Áo"} />
              }} />
              <Route exact path="/menuburger" render={(props) => {
                return <Menu {...props} addtoCart={this._addtoCart} state={this.state} category={"Quần"} />
              }} />
              <Route exact path="/menumilktea" render={(props) => {
                return <Menu {...props} addtoCart={this._addtoCart} state={this.state} category={"Phụ kiện"} />
              }} />
              <Route exact path="/order/list/:orderID" render={(props) => {
                return <OrderListSearch {...props} state={this.state} />
              }} />
              <Route exact path="/admin" render={(props) => {
                return <ProductManagement
                 {...props} state={this.state} />
              }} />
            </Switch>
          </React.Suspense>
        </BrowserRouter>
        {
          this.state.status === STATUS.SUCCESS &&
          <div className="custom-alert-dialog alert alert-success" role="alert">
            Thêm hàng thành công. <a href="/cart" className="alert-link">Xem giỏ hàng</a>.
        </div>
        }
        <Footer />
      </div>

    );
  }
}

export default App;
