const express = require('express');
const sql = require('mssql');

const cartRouter = express.Router();

/**
 * Nhận request trả về thông tin đơn hàng chưa thanh toán (giỏ hàng) của tất cả username
 * Thông tin bao gồm:
 * ProductID, Name, Image (Tên file ảnh), Quantity, Price (Đơn giá)
 */
 cartRouter.get('/', async (req, res) => {
    try {
        // Lấy dữ liệu từ database
        const result = await new sql.Request().query(`
            SELECT Cart.Username, SUM(Product.Price*Cart.Quantity)*1.05 AS Total FROM [Cart]
            INNER JOIN [Product] ON Cart.ProductID = Product.ProductID
            GROUP BY Cart.Username
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
 * Nhận request trả về thông tin giỏ hàng của username
 * Thông tin giỏ hàng bao gồm:
 * ProductID, Name, Image (Tên file ảnh), Quantity, Price (Đơn giá)
 */
 cartRouter.get('/:username', async (req, res) => {
    try {
        // Lấy dữ liệu từ database
        const result = await new sql.Request().query(`
            SELECT Cart.ProductID, Name, Image, Quantity, Price FROM [Cart]
            INNER JOIN [Product] ON Cart.ProductID = Product.ProductID
            WHERE Username = '${req.params.username}'
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
 * Nhận request thêm sản phẩm vào giỏ hàng
 * trả về true/báo lỗi
 */
cartRouter.post('/', async (req, res) => {
    try {
        // Kiểm tra xem sản phẩm được thêm đã có trong giỏ hàng chưa
        const checkResult = await new sql.Request().query(`
            SELECT * FROM [Cart]
            WHERE ProductID = '${req.body.productID}' AND Username = '${req.body.username}'
        `);
        // Nếu có rồi thì tăng số lượng 
        if (checkResult.rowsAffected[0]) {
            const result = await new sql.Request().query(`
                UPDATE [Cart]
                SET Quantity = Quantity + ${req.body.quantity}
                WHERE ProductID = '${req.body.productID}' AND Username = '${req.body.username}'
            `);
            res.status(201).json({ success: true });
        
        // Nếu chưa có thì thêm mới vào giỏ hàng
        } else {
            const addQuery = `
                INSERT INTO [Cart]
                VALUES (
                    '${req.body.username}',
                    '${req.body.productID}',
                    '${req.body.quantity}'
                )
            `
            // console.log(addQuery);
            const result = await new sql.Request().query(addQuery);
            res.status(201).json({ success: true });
        }
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

cartRouter.delete('/', async (req, res) => {
    try {
        // Xóa sản phẩm trong giỏ hàng trong database
        const result = await new sql.Request().query(`
            DELETE FROM [Cart]
            WHERE ProductID = '${req.body.productID}' AND Username = '${req.body.username}'
        `);
        res.status(201).json({ success: true });
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

cartRouter.put('/', async (req, res) => {
    try {
        // Update số lượng sản phẩm trong giỏ hàng trong database
        const result = await new sql.Request().query(`
            UPDATE [Cart]
            SET Quantity = ${req.body.quantity}
            WHERE ProductID = '${req.body.productID}' AND Username = '${req.body.username}'
        `);
        res.status(201).json({ success: true });
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = cartRouter;