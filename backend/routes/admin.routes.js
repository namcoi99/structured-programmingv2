const express = require('express');
const sql = require('mssql');

const adminRouter = express.Router();

/**
 * Nhận request trả về thống kê:
 * tổng số sản phẩm 
 * tổng số sản phẩm đã bán
 * tổng số khách hàng
 * tổng số đơn hàng đã được đặt
 * tổng doanh thu (số tiền đã bán được)
 * 
 * Hàm này chưa được gọi đến trong frontend
 */
adminRouter.get('/count', async (req, res) => {
    try {
        // Lấy dữ liệu từ database
        const result = await new sql.Request().query(`
            SELECT COUNT(*) AS NumberOfProducts, SUM(Sold) AS Sold
            FROM [Product]
            SELECT COUNT(*) AS NumberOfCustomers
            FROM [Customer]
            SELECT COUNT(*) AS NumberOfOrders, SUM(Total) AS Total
            FROM [Order]
        `);

        // Trả về kết quả
        res.status(201).json({
            success: true,
            products: result.recordsets[0][0].NumberOfProducts,
            sold: result.recordsets[0][0].Sold,
            users: result.recordsets[1][0].NumberOfCustomers,
            orders: result.recordsets[2][0].NumberOfOrders,
            total: result.recordsets[2][0].Total
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
 * Nhận request trả về 5 đơn hàng được đặt gần nhất
 */
adminRouter.get('/recent-orders', async (req, res) => {
    try {
        // Lấy dữ liệu từ database
        const result = await new sql.Request().query(`
            SELECT TOP 5 * FROM [Order]
            ORDER BY CreateDate DESC
        `);
        // Trả về kết quả
        res.status(201).json({
            success: true,
            recordset: result.recordset
        });
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình lấy dữ liệu từ database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = adminRouter;