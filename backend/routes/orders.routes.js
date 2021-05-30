const express = require('express');
const sql = require('mssql');

const orderRouter = express.Router();

/**
 * Nhận request tạo đơn hàng mới
 * trả về true/báo lỗi
 */
orderRouter.post('/new-order', async (req, res) => {
    try {
        console.log(req.body);
        // Đặt orderID = s tính theo thời điểm hiện tại
        const orderID = new Date().getTime();
        // Đặt ngày tạo đơn hàng
        const createDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
        console.log(createDate);

        // Thêm mới thông tin đơn hàng vào bảng Order
        const newOrderQuery = `
            INSERT INTO [Order]
            VALUES (
                '${orderID}',
                '${req.body.username}',
                '${createDate}',
                '${req.body.total}',
                N'${req.body.status}'
            )
        `;
        const newOrderResult = await new sql.Request().query(newOrderQuery);

        // Thêm mới danh sách các sản phẩm trong giỏ hàng vào bảng OrderList
        for (const product of req.body.orderList) {
            await new sql.Request().query(`
                INSERT INTO OrderList
                VALUES (
                    '${orderID}',
                    '${product.productID}',
                    '${product.quantity}'
                )
            `);
        }
        await new sql.Request().query(`
            DELETE FROM [Cart]
            WHERE Username = '${req.body.username}'
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

/**
 * Nhận request xóa đơn hàng theo mã đơn hàng
 * trả về true/báo lỗi
 */
orderRouter.delete('/:orderID', async (req, res) => {
    try {
        // Kiểm tra xem đơn hàng có tồn tại hay không
        const checkResult = await new sql.Request().query(`
            SELECT * FROM [Order]
            WHERE OrderID = '${req.params.orderID}'
        `);

        // Nếu không tồn tại thì gửi lại lỗi 
        if (!checkResult.rowsAffected[0]) {
            res.json({
                success: false,
                message: "OrderID not exist"
            });

            // Nếu có tồn tại thì thực hiện xóa 
            // Xóa OrderList trước do ràng buộc trong CSDL
        } else {
            const delQuery = `
                DELETE FROM [OrderList]
                WHERE OrderID = '${req.params.orderID}'
                DELETE FROM [Order]
                WHERE OrderID = '${req.params.orderID}'
            `;
            await new sql.Request().query(delQuery);
            res.status(200).json({ success: true });
        }
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nhận request lấy danh sách thông tin các đơn hàng của User
 */
orderRouter.get('/list/:username', async (req, res) => {
    try {
        // Lấy dữ liệu từ CSDL
        const result = await new sql.Request().query(`
            SELECT * FROM [Order]
            WHERE Username = '${req.params.username}'
            ORDER BY CreateDate DESC 
        `);
        
        // Trả về kết quả
        res.status(200).json({
            success: true,
            data: {
                recordset: result.recordset,
                total: result.rowsAffected[0]
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

/**
 * Nhận request trả về
 * thông tin đơn hàng theo mã đơn hàng 
 * + danh sách sản phẩm trong đơn hàng 
 */
orderRouter.get('/:orderID', async (req, res) => {
    try {
        // Kiểm tra xem đơn hàng có tồn tại hay không
        const checkResult = await new sql.Request().query(`
            SELECT * FROM [Order]
            WHERE OrderID = '${req.params.orderID}'
        `);
        // Nếu không tồn tại thì gửi lại lỗi 
        if (!checkResult.rowsAffected[0]) {
            res.json({
                success: false,
                message: "OrderID not exist"
            });

        // Nếu có tồn tại thì lấy dữ liệu các sản phẩm trong đơn hàng đó
        // (Tìm trong OrderList các bản ghi có OrderID = req.params.orderID)
        } else {
            // orderlist
            const orderList = await new sql.Request().query(`
                SELECT OrderList.ProductID, Name, Image, Quantity, Price FROM [OrderList]
                INNER JOIN [Product] ON OrderList.ProductID = Product.ProductID
                WHERE OrderID = '${req.params.orderID}'
            `);
            
            // Trả về kết quả
            res.status(200).json({
                success: true,
                data: {
                    detail: checkResult.recordset[0],
                    orderList: orderList.recordset
                }
            });
        }
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = orderRouter;