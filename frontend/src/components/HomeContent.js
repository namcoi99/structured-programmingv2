import React, { Component } from 'react';
import '../Css/home.css';

// Đây là component hiển thị nội dung trang chủ
class HomeContent extends Component {
    constructor(props) {
        super(props)
        // Lưu tất cả sản phẩm bao gồm cả sản phẩm thịnh hành(trending) vào state
        this.state = {
            trendingproducts: [],
            products: [],
            total: 0,
            currentCategory: 'Shirt',
            currentPageNumber: 1,
            maxPageNumber: 1,
        }
        this.getTrending();
        this.getData(1);
    }

    // Lấy ra các sản phẩm bán chạy nhất từ csdl
    getTrending = async () => {
        try {
            const data = await fetch(`http://localhost:5000/product/best-seller`,
            ).then((res) => { return res.json(); });
            this.setState({
                trendingproducts: data.data
            });
        } catch (err) {
            window.alert(err.message);
        }
    }

    // Lấy ra các sản phẩm theo phân loại hiện tại
    getData = async (pageNumber) => {
        try {
            // các sản phẩm được lấy ra theo từng trang(pagination) với mỗi trang gồm 4 sản phẩm(pageSize=4) theo phân loại currentCategory hiện tại
            const data = await fetch(`http://localhost:5000/filter/category?pageNumber=${pageNumber}&pageSize=4&category=${this.state.currentCategory}`,
            ).then((res) => { return res.json(); });
            this.setState({
                total: data.data.total,
                products: data.data.recordset,
                //Tổng số phân trang cho toàn bộ sản phẩm theo phân loại
                maxPageNumber: Math.ceil(data.data.total / 4)
            });
        } catch (err) {
            window.alert(err.message);
        }
    }

    // Hiển thị sản phẩm theo số trang được chọn
    handlePageChange = (pageNumber) => {
        this.getData(pageNumber);
        this.setState({
            currentPageNumber: pageNumber
        });
    }

    // Tương tự handlePageChange nhưng là giảm số trang hiện tại đi 1
    handlePrevClick = () => {
        if (this.state.currentPageNumber > 1) {
            this.getData(this.state.currentPageNumber - 1);
            this.setState({
                currentPageNumber: (this.state.currentPageNumber - 1)
            });
        }
    }

    // Tương tự handlePrevClick
    handleNextClick = () => {
        if (this.state.currentPageNumber < this.state.maxPageNumber) {
            this.getData(this.state.currentPageNumber + 1);
            this.setState({
                currentPageNumber: (this.state.currentPageNumber + 1)
            });
        }
    }

    render() {
        // Số trang từ 1 đến trang cuối cùng
        const paginations = [];
        for (let i = 1; i <= this.state.maxPageNumber; i++) {
            paginations.push(i);
        }
        // Biến hiển thị các sản phẩm trending
        const Trending = this.state.trendingproducts.map(item => (
            <div key={item.ProductID} className='trending-item-root'>
                <div className="trending-item" data-aos="fade-right" data-aos-delay="500" style={{textAlign: "center"}}>
                    <div className="trending-item-img">
                        <a href={`/product/${item.ProductID}`} target="__blank">
                            <img src={`http://localhost:5000/image/products/${item.Image}`} alt={item.Name}
                                style={{
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    height: '400px',
                                    objectFit: 'contain',
                                    width: '100%'
                                }} />
                        </a>
                    </div>
                    <div className="trending-item-text">
                        <a href={`/product/${item.ProductID}`} target="__blank">
                            <h2>{item.Name.length >= 20 ? `${item.Name.slice(0, 20)}...` : item.Name}</h2>
                        </a>
                    </div>
                    <div className="trending-item-cost">
                        <span>{item.Price}đ</span>
                    </div>
                    <div>Số lượng đã bán: {item.Sold}</div>
                    <a href='/' onClick={(event) => { this.props.addtoCart(item, 1, event) }}>
                        <div className="trending-item-expand">
                            <div className="expand-cart">
                                <i className="fas fa-cart-plus"></i>
                                <p> Thêm vào giỏ hàng</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        ))
        // Biến hiển thị tất cả sản phẩm theo phân loại và phân trang
        const Products = this.state.products.map(item => (
            <div key={item.ProductID} className="card" style={{ width: "20rem" }}>
                <a href={`/product/${item.ProductID}`} target="__blank">
                    <img className="card-img-top" src={`http://localhost:5000/image/products/${item.Image}`} alt={item.Name} style={{
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '300px',
                        width: '100%'
                    }} />
                </a>
                <div className="card-body" style={{textAlign: "center"}}>
                    <h2 className="card-title" style={{ fontWeight: "bolder" }}>{item.Name.length >= 20 ? `${item.Name.slice(0, 20)}...` : item.Name}</h2>
                    <p className="card-text text-success"><span>{item.Price}đ</span></p>
                    <p className="">Số lượng đã bán: {item.Sold}</p>
                    <button type="button" className="btn btn-danger" onClick={(event) => { this.props.addtoCart(item, 1, event) }}>
                        <i className="fas fa-cart-plus mr-2"></i>  Thêm vào giỏ hàng
                    </button>
                </div>

                {/* <div key={item.ProductID} className='trending-item-root'>
                    <div className="trending-item" data-aos="fade-right" data-aos-delay="500">
                        <div className="trending-item-img">
                            <a href={`/product/${item.ProductID}`} target="__blank">
                                <img src={`http://localhost:5000/image/products/${item.Image}`} alt={item.Name} style={{
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeate',
                                    height: '300px',
                                    width: '100%'
                                }} />
                            </a>
                        </div>
                        <div className="trending-item-text">
                            <a href={`/product/${item.ProductID}`} target="__blank">
                                <h2>{item.Name}</h2>
                            </a>
                        </div>
                        <div className="trending-item-cost">
                            <span>{item.Price}đ</span>
                        </div>
                        <div>Số lượng đã bán: {item.Sold}</div>
                        <a href='/' onClick={(event) => { this.props.addtoCart(item, 1, event) }}>
                            <div className="trending-item-expand">
                                <div className="expand-cart">
                                    <i className="fas fa-cart-plus"></i>
                                    <p>Thêm vào giỏ hàng</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div> */}
            </div>
        ))

        return (
            //  content
            <div id="home" >
                {/* <div className="home-top">
                    <a href="/">Trang chủ</a>
                </div> */}
                {/* Carousel */}
                <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="http://localhost:5000/image/carousels/carousel-1.jpg" className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src="http://localhost:5000/image/carousels/carousel-2.jpg" className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src="http://localhost:5000/image/carousels/carousel-3.jpg" className="d-block w-100" alt="..." />
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="sr-only">Next</span>
                    </a>
                </div>
                {/* Trending  */}
                <div className="trending-product">
                    <div className="trending-header">
                        <h1>Sản phẩm bán chạy</h1>
                    </div>
                    <div className="trending-item-container" >
                        {Trending}
                    </div>
                </div>
                {/* main-menu */}
                <div className="main-menu-2">
                    <div className="main-menu-header">
                        <div className="main-menu-top">Sản phẩm chất lượng nhất♪♫♪♫ </div>
                        <div className="main-menu-center">Choose & enjoy</div>
                        <div className="main-menu-bottom mb-2">
                            Nhanh tay đặt hàng ngay hôm nay
                        </div>
                    </div>
                    {/* pagination */}
                    <div className="pagination">
                        <div className="pagination-item pag-1"
                            // Thay đổi sản phẩm theo phân loại(Category)
                            onClick={async () => {
                                // Thay đổi phân loại hiện tại trong state khi click vào phân loại tương ứng
                                await this.setState({
                                    currentCategory: 'Shirt',
                                    currentPageNumber: 1,
                                });
                                this.getData(1);
                            }} >
                            <i className="fas fa-tshirt"></i>
                            <h2>Áo</h2>
                        </div>
                        <div className="pagination-item pag-2"
                            onClick={async () => {
                                await this.setState({
                                    currentCategory: 'Pants',
                                    currentPageNumber: 1,
                                });
                                this.getData(1);
                            }} >
                            <i className="fas fa-socks"></i>
                            <h2>Quần</h2>
                        </div>
                        <div className="pagination-item pag-3"
                            onClick={async () => {
                                await this.setState({
                                    currentCategory: 'Bag',
                                    currentPageNumber: 1
                                });
                                this.getData(1);
                            }} >
                            <i className="fas fa-shopping-bag"></i>
                            <h2>Phụ kiện</h2>
                        </div>
                    </div>
                    {/* main-manu-display */}
                    <div className="main-menu-display-container area-1 mt-3 mb-2">
                        <div className="sub-main-menu-display-container">
                            {Products}
                        </div>

                        {/* TODO: Pagination */}
                        <nav aria-label="Page navigation">
                            {/* Thay đổi sản phẩm theo số trang */}
                            <ul className="pagination justify-content-center pagination-temp">
                                {/* Nếu là trang đầu tiên thì sẽ ko back lại trang trước được */}
                                <li className={`page-item ${this.state.currentPageNumber === 1 ? 'disabled' : ''}`}
                                    onClick={this.handlePrevClick}>
                                    <a className="page-link" href='/' onClick={e => e.preventDefault()} aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                </li>
                                {/* Custom style cho mục số trang */}
                                {paginations.map((item) => {
                                    return (
                                        // Nếu là trang hiện tại thì sẽ hiển thị là active
                                        <li className={`page-item ${item === this.state.currentPageNumber ? 'active' : ''}`}
                                            key={item}
                                            onClick={() => { this.handlePageChange(item) }}
                                        >
                                            <a className="page-link" href='/' onClick={e => e.preventDefault()}>{item}</a>
                                        </li>
                                    );
                                })}
                                {/* Nếu là trang cuối cùng thì sẽ ko next trang sau được */}
                                <li className={`page-item ${this.state.currentPageNumber === this.state.maxPageNumber ? 'disabled' : ''}`}
                                    onClick={this.handleNextClick}>
                                    <a className="page-link" href='/' onClick={e => e.preventDefault()} aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeContent;