const express = require('express');
const sql = require('mssql');

const orderRouter = express.Router();

/**
 * Nhận request lấy danh sách thông tin các đơn hàng của 1 User/ tất cả Users
 */
orderRouter.get('/', async (req, res) => {
    try {
        // Lấy dữ liệu từ CSDL
        const result = await new sql.Request().query(`
            SELECT * FROM [Order]
            ${req.query.username === 'all' ? '' : `WHERE Username = '${req.query.username}'`} 
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
 * thông tin chủ đơn hàng
 * + danh sách sản phẩm trong đơn hàng 
 */
orderRouter.get('/:orderID', async (req, res) => {
    try {
        // Kiểm tra xem đơn hàng có tồn tại hay không
        const checkResult = await new sql.Request().query(`
            SELECT [Order].*, Customer.Name, Customer.Address, Customer.Phone FROM [Order]
            INNER JOIN [Customer] ON Customer.Username = [Order].Username
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

orderRouter.post('/', async (req, res) => {
    try {
        console.log(req.body);
        // Đặt orderID = s tính theo thời điểm hiện tại
        const orderID = new Date().getTime();
        const createDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
        console.log(createDate);
        // new orderinfo
        const newOrderQuery = `
            INSERT INTO [Order]
            VALUES (
                '${orderID}',
                '${req.body.username}',
                '${createDate}',
                '${req.body.total}',
                N'Đã thanh toán'
            )
        `;
        const newOrderResult = await new sql.Request().query(newOrderQuery);

        // new orderlist
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

const updateSold = async (orderList) => {
    try {
        for (const item of orderList) {
            await new sql.Request().query(`
                UPDATE [Product]
                SET Sold = Sold - ${item.Quantity}
                WHERE Product.ProductID = ${item.ProductID}
            `);
        }
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

orderRouter.put('/', async (req, res) => {
    try {
        const result = await new sql.Request().query(`
            UPDATE [Order]
            SET Status =N'${req.body.status}'
            WHERE OrderID = '${req.body.orderID}'
        `);
        // Nếu không tồn tại thì gửi lại lỗi 
        if (!result.rowsAffected[0]) {
            res.json({
                success: false,
                message: "OrderID not exist"
            });
        } else {
            // Nếu có tồn tại thì thực hiện update số lượng sản phẩm đã bán
            const orderList = await new sql.Request().query(`
                SELECT * FROM [OrderList]
                WHERE OrderID = '${req.body.orderID}'
            `);
            updateSold(orderList.recordset);

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

            // Nếu có tồn tại thì thực hiện xóa orderlist
        } else {
            // Nếu đơn hàng không trong trạng thái đã hủy thì thực hiện update số lượng đã bán
            if (checkResult.recordset[0].Status != "Đã hủy") {
                const orderList = await new sql.Request().query(`
                    SELECT * FROM [OrderList]
                    WHERE OrderID = '${req.params.orderID}'
                `);
                console.log(orderList)
                updateSold(orderList.recordset);
            }

            // Thực hiện xóa OrderList trước do ràng buộc trong CSDL
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

module.exports = orderRouter;