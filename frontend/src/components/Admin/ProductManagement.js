import React, { Component } from "react";
import axios from "axios";
import PaginationBar from "./PaginationBar";

const NUMBER_PRODUCTS_PER_PAGE = 10;

class ProductManagement extends Component {

    constructor(props) {
        super(props)
        this.getProductByPage = this.getProductByPage.bind(this)
    }

    state = {
        products: [],
        activePage: 1,
        totalPages: 0,
        id: '',
        category: '',
        info: '',
        name: '',
        price: 0,
        sold: 0,
        image: '',
        deleteId: null,
        addPopUp: true,
    }

    saveProductDB = () => {
        axios.post('http://localhost:5000/product/new-product',
            {
                productID: this.state.id,
                name: this.state.name,
                price: this.state.price,
                info: this.state.info,
                image: this.state.image,
                category: this.state.category,
                sold: this.state.sold,
            })
            .then(() => {
                this.getProductByPage(this.state.activePage);
                this.setState({
                    id: '',
                    category: '',
                    info: '',
                    name: '',
                    price: 0,
                    sold: 0,
                    image: '',
                })
            })
            .catch(() => console.log("EROR"))

    }

    deleteProduct = () => {
        axios.delete('http://localhost:5000/product/' + this.state.deleteId)
            .then(() => this.getProductByPage(this.state.activePage));
    }

    updateProduct = () => {
        axios.put('http://localhost:5000/product/', {
            ...this.state,
            productID: this.state.id,
        })
        .then(() => this.getProductByPage(this.state.activePage));
    }

    componentDidMount() {
        this.getProductByPage(this.state.activePage)
    }
    /*chạy 1 lần duy nhất khi user chưa làm gì*/

    getProductByPage(page) {
        axios.get('http://localhost:5000/product/list',
            {
                params: {
                    pageSize: NUMBER_PRODUCTS_PER_PAGE,
                    pageNumber: page
                }
            }
        )
            .then((response) => {
                const {
                    recordset, total
                } = response.data.data
                this.setState({
                    activePage: page,
                    products: recordset,
                    totalPages: Math.ceil(total / NUMBER_PRODUCTS_PER_PAGE)
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        console.log(this.state.products)
        return (
            <>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" 
                onClick={()=>this.setState({
                    addPopUp: true, id: '',
                    category: '',
                    info: '',
                    name: '',
                    price: 0,
                    sold: 0,
                    image: '',})}>Thêm sản phẩm
                                    
                </button>

                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Thêm sản phẩm</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                {/*event: tham số thuộc tính trả ra*/}
                                <div>Id: <input value={this.state.id} placeholder="" onChange={event => this.setState({ id: event.target.value })} /></div>
                                <div>Category: <input value={this.state.category} placeholder="" onChange={event => this.setState({ category: event.target.value })} /></div>
                                <div>Info: <input value={this.state.info} placeholder="" onChange={event => this.setState({ info: event.target.value })} /></div>
                                <div>Name: <input value={this.state.name} placeholder="" onChange={event => this.setState({ name: event.target.value })} /></div>
                                <div>Price: <input value={this.state.price} placeholder="" onChange={event => this.setState({ price: event.target.value })} /></div>
                                <div>Sold: <input value={this.state.sold} placeholder="" onChange={event => this.setState({ sold: event.target.value })} /></div>
                                <div>Image: <input value={this.state.image} placeholder="" onChange={event => this.setState({ image: event.target.value })} /></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    type="button"
                                    data-dismiss="modal"
                                    class="btn btn-primary"
                                    onClick={()=>{
                                        if(this.state.addPopUp)
                                            {
                                                this.saveProductDB()
                                            }
                                        else {
                                            this.updateProduct()
                                        }
                                    }}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Category</th>
                            <th scope="col">Info</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((product, index) => (
                                <tr key={index}>
                                    <th scope="row">{product.ProductID}</th>
                                    <td>{product.Category}</td>
                                    <td>{product.Info}</td>
                                    <td>{product.Name}</td>
                                    <td>{product.Price}</td>
                                    <td>{product.Sold}
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            data-toggle="modal" data-target="#deleteModal"
                                            /*bật modal*/
                                            onClick={() => this.setState({
                                                deleteId: product.ProductID
                                                //lưu ID vào state
                                            })}>Delete</button>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            data-toggle="modal" data-target="#exampleModal"
                                            /*bật modal*/
                                            onClick={() => this.setState({
                                                id: product.ProductID,
                                                category: product.Category,
                                                info: product.Info,
                                                name: product.Name,
                                                price: product.Price,
                                                sold: product.Sold,
                                                image: product.Image,
                                                addPopUp: false,
                                            })}>Update</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Xóa sản phẩm</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                Bạn có chắc muốn xóa sản phẩm với id là {this.state.deleteId} này không ?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                                <button
                                    type="button"
                                    data-dismiss="modal"
                                    class="btn btn-primary"
                                    onClick={this.deleteProduct}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>

                <PaginationBar

                    activePage={this.state.activePage}
                    totalPages={this.state.totalPages}
                    onPageChange={this.getProductByPage}
                />
            </>
        )
    }
}

export default ProductManagement;