const express = require('express');
const sql = require('mssql');

const filterRouter = express.Router();

/**
 * Nhận request lọc sản phẩm theo khoảng giá (from MIN to MAX)
 * (optional) Trường sắp xếp (vd: giá tiền, hàng mới về)
 * Giá tăng dần/ giảm dần
 */
filterRouter.get('/price', async (req, res) => {
    try {
        const query = `
            SELECT * FROM Product
            WHERE Price BETWEEN ${req.query.from} AND ${req.query.to} 
            AND Category LIKE N'${req.query.category}'
            ORDER BY ${req.query.sortField ? req.query.sortField : 'Sold'} ${req.query.sortDirection > 0 ? 'ASC' : 'DESC'}
            OFFSET ${(req.query.pageNumber - 1) * req.query.pageSize} ROWS  
            FETCH NEXT ${req.query.pageSize} ROWS ONLY
        `;
        console.log(query);
        const result = await new sql.Request().query(query);
        const total = await new sql.Request().query(
            `
            SELECT COUNT(*) AS Total FROM Product
            WHERE Price BETWEEN ${req.query.from} AND ${req.query.to}
            AND Category LIKE N'${req.query.category}'
            `
        );
        // console.log(total);
        res.status(200).json({
            success: true,
            data: {
                total: total.recordset[0].Total,
                recordset: result.recordset
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nhận request lọc sản phẩm theo Category
 * (optional) Trường sắp xếp (vd: giá tiền, hàng mới về)
 * Giá tăng dần/ giảm dần
 */
filterRouter.get('/category', async (req, res) => {
    try {
        // Lấy dữ liệu từ database
        // có category là req.query.category
        // (optional) nếu request có trường cần sắp xếp thì sắp xếp theo trường đó (vd: hàng mới về -> trường sắp xếp là CreateDate) (mặc định sắp xếp theo giá)
        // (Pagination) chỉ lấy 1 lượng dữ liệu (pageSize) từ trong 1 page (pageNumber) 
        const query = `
            SELECT * FROM [Product]
            WHERE Category LIKE N'${req.query.category}'
            ORDER BY ${req.query.sortField ? req.query.sortField : 'Sold'} ${req.query.sortDirection > 0 ? 'ASC' : 'DESC'}
            OFFSET ${(req.query.pageNumber - 1) * req.query.pageSize} ROWS  
            FETCH NEXT ${req.query.pageSize} ROWS ONLY
        `;
        // console.log(query);
        const result = await new sql.Request().query(query);

        // Lấy dữ liệu tổng tất cả sản phẩm trong 1 Category
        const total = await new sql.Request().query(
            `
            SELECT COUNT(*) AS Total FROM Product
            WHERE Category LIKE N'${req.query.category}'
            `
        );
        // console.log(total);

        // Trả về dữ liệu
        res.status(200).json({
            success: true,
            data: {
                total: total.recordset[0].Total,
                recordset: result.recordset
            }
        });
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = filterRouter;