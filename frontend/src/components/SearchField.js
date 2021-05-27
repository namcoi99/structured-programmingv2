import React, { Component } from 'react';


// Đây là component hiển thị ô tìm kiếm
class SearchField extends Component {

    state = {
        searchText:''
    }

    // Thay đổi state theo nội dung muốn tìm
    onChange = (e) => {
        this.setState({searchText:e.target.value});
    }

    // Gọi tới hàm handleSearch để tìm kiếm
    handleSubmit = e => {
        e.preventDefault();
        if(this.state.searchText) this.props.handleSearch(this.state.searchText);
    }

    render() {
        return (
            <div className="search-menu">
                <form onSubmit={this.handleSubmit}>
                    <input placeholder="Tìm kiếm sản phẩm" onChange={this.onChange}/>
                    <button type='submit' className='btn btn-primary'>Click</button>
                </form>
                
            </div>
        );
    }
}

export default SearchField;