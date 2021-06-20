const express = require('express');
const sql = require('mssql');
const isAdministrator = require('../middleware/checkPermission');

const productRouter = express.Router();

// productRouter.post('/', isAdministrator, async (req, res) => {
productRouter.post('/', async (req, res) => {
    try {
        
        console.log(req.body)
        // console.log(req.params.productID)
        const query = `
                INSERT INTO [Product]
                VALUES (
                    N'${req.body.name}',
                    '${req.body.price}',
                    N'${req.body.info}',
                    '${req.body.image}',
                    '${req.body.category}',
                    '${req.body.sold}'
                )
            `;
        await new sql.Request().query(query);
        res.status(201).json({ success: true });
        // }
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
});

// productRouter.put('/:productID', isAdministrator, async (req, res) => {
productRouter.put('/:productID', async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.params.productID)
        const query = `
                UPDATE [Product]
                SET 
                    Name = N'${req.body.name}',
                    Price = '${req.body.price}',
                    Info = N'${req.body.info}',
                    Image = '${req.body.image}',
                    Category = '${req.body.category}',
                    Sold = '${req.body.sold}'
                WHERE ProductID = '${req.params.productID}'
            `;
        await new sql.Request().query(query);
        res.status(200).json({ success: true });
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
});

// productRouter.delete('/:productID', isAdministrator, async (req, res) => {
productRouter.delete('/:productID', async (req, res) => {
    try {
        console.log(req.params.productID)
        await new sql.Request().query(`
            DELETE FROM [Product]
            WHERE ProductID = '${req.params.productID}'
        `);
        res.status(201).json({ success: true });
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
});

productRouter.get('/', async (req, res) => {
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
            ${req.query.category ? ("WHERE Category LIKE 'N" + req.query.category + "'") : ''}
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