const express = require('express');
const sql = require('mssql');
const  isAdministrator = require('../middleware/checkPermission');

const productRouter = express.Router();

/**
 * Nhận request thêm sản phẩm mới vào CSDL
 * trả về true/báo lỗi
 * 
 * Note: middleware isAdminstrator không có tác dùng gì 
 */
productRouter.post('/new-product', isAdministrator, async (req, res) => {
    try {
        // Kiểm tra xem mã sản phẩm đã có tồn tại từ trước chưa
        const checkQuery = `
            SELECT * FROM Product
            WHERE ProductID = '${req.body.productID}'
        `;
        console.log(checkQuery)
        const checkResult = await new sql.Request().query(checkQuery);
        // if (checkResult.rowsAffected[0]) {
        //     res.json({
        //         success: false,
        //         message: "Duplicate ProductID"
        //     });
        // } else {

        // Thêm sản phẩm mới vào CSDL
        const newQuery = `
                INSERT INTO Product
                VALUES (
                    '${req.body.productID}',
                    '${req.body.name}',
                    '${req.body.price}',
                    '${req.body.info}',
                    '${req.body.image}',
                    '${req.body.category}',
                    '${req.body.sold}'
                )
            `;
        const newResult = await new sql.Request().query(newQuery);
        res.status(201).json({ success: true });
        // }
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nhận request update thông tin sản phẩm
 * trả về true/báo lỗi
 */
productRouter.put('/', async (req, res)=> {
    try {
        const newQuery = `
                UPDATE Product 
                SET
                    Name = '${req.body.name}',
                    Price = '${req.body.price}',
                    Info = '${req.body.info}',
                    Image = '${req.body.image}',
                    Category = '${req.body.category}',
                    Sold = '${req.body.sold}'
                WHERE ProductID = '${req.body.productID}'
            `;
        const newResult = await new sql.Request().query(newQuery);
        res.status(201).json({ success: true });
    } catch (error) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({ success: false })
    }
});

/**
 * Nhận request trả về 
 * danh sách các sản phẩm trong CSDL
 * danh sách các sản phẩm cần tìm kiếm theo từ khóa (optinal)
 */
productRouter.get('/list', async (req, res) => {
    try {
        // Lấy dữ liệu từ CSDL
        // (optional) tìm kiếm các sảm phẩm có tên chứa từ khóa
        const viewQuery = `
            SELECT * FROM Product
            ${req.query.keyword ? ("WHERE Name LIKE N'%" + req.query.keyword + "%'") : ''}
            ORDER BY ${req.query.sortField ? req.query.sortField : 'Sold'} ${req.query.sortDirection > 0 ? 'ASC' : 'DESC'}
            OFFSET ${(req.query.pageNumber - 1) * req.query.pageSize} ROWS  
            FETCH NEXT ${req.query.pageSize} ROWS ONLY
            `
        console.log(viewQuery);
        const viewResult = await new sql.Request().query(viewQuery);

        // Đếm tổng số sản phẩm (thỏa mãn yêu cầu)
        const total = await new sql.Request().query(
            `
            SELECT COUNT(*) AS Total FROM Product
            ${req.query.keyword ? ("WHERE Name LIKE '%" + req.query.keyword + "%'") : ''}
            `
        );
        
        // Trả về kết quả
        res.status(201).json({
            success: true,
            data: {
                total: total.recordset[0].Total,
                recordset: viewResult.recordset
            }
        });
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình lấy dữ liệu từ database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nhận request trả về 
 * 8 sản phẩm có số lượng bán ra nhiều nhất (best seller)
 * trong tổng số tất cả sản phẩm
 * hoặc trong 1 category (optional)
 */
productRouter.get('/best-seller', async (req, res) => {
    try {
        // Lấy dữ liệu từ CSDL
        // (optional) Nếu có yêu cầu về category cụ thể thì chỉ lấy các phẩm trong category đó
        const result = await new sql.Request().query(`
            SELECT TOP 8 * FROM Product
            ${req.query.category ? ("WHERE Category LIKE 'N" + req.query.category + "'"):''}
            ORDER BY Sold DESC
        `);

        // Trả về kết quả
        res.status(201).json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình lấy dữ liệu từ database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nhận request trả về 
 * thông tin sản phẩm theo ID
 */
productRouter.get('/:productID', async (req, res) => {
    try {
        // Kiểm tra sản phẩm có tồn tại hay không
        const result = await new sql.Request().query(`
            SELECT * FROM Product
            WHERE ProductID = '${req.params.productID}'
        `);

        // Nếu không tồn tại thì trả về lỗi
        if (!result.rowsAffected[0]) {
            res.json({
                success: false,
                message: "ProductID not exist"
            });
        } else {
            res.status(201).json({
                success: true,
                data: result.recordset[0]
            });
        }
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình lấy dữ liệu từ database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nhận request xóa sản phẩm trong CSDL
 * trả về true/báo lỗi
 */
productRouter.delete('/:id', async(req, res) => {
    try {
        // Xóa sản phẩm  trong CSDL
        const result = await new sql.Request().query(`
            DELETE FROM Product
            WHERE ProductID = '${req.params.id}'
        `);

        // Báo lỗi nếu không tồn tại sản phẩm trong CSDL
        if (!result.rowsAffected[0]) {
            res.json({
                success: false,
                message: "ProductID not exist"
            });
        } else {
            res.status(201).json({
                success: true,
            });
        }
    } catch (error) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
        });
    }
})

module.exports = productRouter;