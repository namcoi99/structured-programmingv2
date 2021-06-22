import React, { Component } from 'react'
import axios from '../../axios.js'
import '../../Css/addform.css'

const maxFileSize = 5000000;
const imageFileRegex = /\.(gif|jpg|jpeg|tiff|png)$/;

export default class ProductFrom extends Component {

    state = {
        Name: this.props.item.Name,
        Category: this.props.item.Category ? this.props.item.Category : 'Bag',
        Info: this.props.item.Info ? this.props.item.Info : "",
        Price: this.props.item.Price,
        Sold: this.props.item.Sold ? this.props.item.Sold : 0,

        file: undefined,
        fileName: "",
        fileHasChange: false,
        imageUrl: this.props.item.Image ? `http://localhost:5000/image/products/${this.props.item.Image}` : "",
        errMessage: ""
    };

    handleChange = (event) => {
        let target = event.target;
        let value = target.value;
        let name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleFileChange = (event) => {
        const file = event.target.files[0];

        //validate file
        if (!imageFileRegex.test(file.name)) {
            this.setState({
                file: undefined,
                fileName: "",
                imageUrl: "",
                errMessage: 'Invalid image file',
            });
        } else if (file.size > maxFileSize) {
            this.setState({
                file: undefined,
                fileName: "",
                imageUrl: "",
                errMessage: 'File too large (Less than 5MB)',
            });
        } else {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file); //ham bat dong bo
            //convert file to base64string
            fileReader.onloadend = () => {
                // console.log(fileReader.result)
                this.setState({
                    file: file,
                    fileName: file.name,
                    fileHasChange: true,
                    imageUrl: fileReader.result,
                    errMessage: ""
                });
            }
        }
    }

    handleAddSubmit = async (event) => {
        event.preventDefault();
        console.log(this.state);

        try {
            if (this.state.errMessage) {
                return this.setState({
                    errMessage: "Error! An error occurred. Please try again later! Unable to process this action"
                });
            }
            // fetch api tao 1 post gom 2 buoc : up anh + them san pham
            // upload file (anh)
            const formData = new FormData();
            formData.append("image", this.state.file);
            const uploadResult = await fetch("http://localhost:5000/upload", {
                method: "POST",
                credentials: 'include',
                body: formData
            }).then((res) => { return res.json(); });

            console.log(uploadResult);

            // them san pham
            const postResult = await fetch("http://localhost:5000/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: this.state.Name,
                    category: this.state.Category,
                    info: this.state.Info,
                    image: uploadResult.filename,
                    price: this.state.Price,
                    sold: this.state.Sold
                })
            }).then((res) => { return res.json(); });

            if (!postResult.success) {
                this.setState({
                    errMessage: postResult.message
                });
            } else {
                window.location.reload();
            }
        } catch (err) {
            this.setState({
                errMessage: err.message
            });
        }
    }

    handleEditSubmit = async (event) => {
        event.preventDefault();
        console.log(this.state);

        try {
            if (this.state.errMessage) {
                return this.setState({
                    errMessage: "Error! An error occurred. Please try again later! Unable to process this action"
                });
            }
            // fetch api tao 1 post gom 2 buoc : up anh + them san pham
            // upload file (anh) neu thanh doi
            let uploadResult = null;
            if (this.state.fileHasChange) {
                const formData = new FormData();
                formData.append("image", this.state.file);
                uploadResult = await fetch("http://localhost:5000/upload", {
                    method: "POST",
                    credentials: 'include',
                    body: formData
                }).then((res) => { return res.json(); });
            }

            // console.log(uploadResult);

            // them san pham
            const postResult = await fetch(`http://localhost:5000/product/${this.props.item.ProductID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: this.state.Name,
                    category: this.state.Category,
                    info: this.state.Info,
                    image: this.state.fileHasChange ? uploadResult.filename : this.props.item.Image,
                    price: this.state.Price,
                    sold: this.state.Sold
                })
            }).then((res) => { return res.json(); });

            if (!postResult.success) {
                this.setState({
                    errMessage: postResult.message
                });
            } else {
                window.location.reload();
            }
        } catch (err) {
            this.setState({
                errMessage: err.message
            });
        }
    }

    render() {
        return (
            <div>
                <div className="container">
                    <form id="contact-form" role="form" onSubmit={this.props.action == "add" ? this.handleAddSubmit : this.handleEditSubmit}>
                        <div className="controls">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="form_name">Tên sản phẩm<span className="required"> *</span></label>
                                        <input id="form_name" name="Name" value={this.state.Name} type="text" className="form-control" required="required" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="form_price">Giá bán (VND) <span className="required"> *</span></label>
                                        <input id="form_price" name="Price" value={this.state.Price} type="number" className="form-control" required="required" onChange={this.handleChange} />
                                    </div>
                                </div>
                                {this.props.action == "edit" ? (
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="form_sold">Số lượng đã bán <span className="required"> *</span></label>
                                            <input id="form_sold" name="Sold" value={this.state.Sold} type="number" className="form-control" required="required" disabled />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="item-category" className="col-sm-4 col-form-label">Danh mục <span className="required"> *</span></label>
                                        <select className="form-control" id="item-category" name="Category" defaultValue={this.state.Category} onChange={this.handleChange}>
                                            <option value='Bag'>Phụ kiện</option>
                                            <option value='Pants'>Quần</option>
                                            <option value='Shirt'>Áo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="form_message">Mô tả</label>
                                        <textarea id="form_message" name="Info" value={this.state.Info} className="form-control" rows={3} onChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="upload-area">
                                {this.state.imageUrl ? (
                                    <div style={{
                                        backgroundImage: `url(${this.state.imageUrl})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        width: '100%',
                                        height: '400px',
                                        marginTop: '1rem',
                                    }}></div>
                                ) : (
                                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                                )}
                                <input type="file" id="customFile" style={{ marginTop: "1rem" }}
                                    onChange={this.handleFileChange} required={this.props.action == "add"} />
                            </div>
                            {this.state.errMessage ? (
                                <div class="alert alert-danger" role="alert">
                                    {this.state.errMessage}
                                </div>
                            ) : null}
                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-success add-button">Lưu</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
