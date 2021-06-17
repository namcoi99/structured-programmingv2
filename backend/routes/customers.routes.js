const express = require('express');
const sql = require('mssql');
const bcryptjs = require('bcryptjs');
const isLoggedIn = require('../middleware/checkLogIn');

const customerRouter = express.Router();

/**
 * Nhận request đăng ký tài khoản
 * trả về true/báo lỗi
 */
customerRouter.post('/register', async (req, res) => {
    // validate email, password, fullname
    // ... may be not need
    console.log(req.body);
    try {
        // Kiểm tra xem đã tồn tại username hay chưa
        const checkQuery = `
            SELECT * FROM Customer
            WHERE Username = '${req.body.username}'
        `;
        // console.log(checkQuery);
        const checkResult = await new sql.Request().query(checkQuery);
        // console.log(checkResult);
        
        // Nếu tồn tại, báo lỗi
        if (checkResult.rowsAffected[0]) {
            res.status(400).json({
                success: false,
                message: "Username has been used"
            });
        } else {
            // hash password bằng bcryptjs 
            const hashPassword = bcryptjs.hashSync(req.body.password, 10);

            // Lưu dữ liệu vào database
            const regQuery = `
                INSERT INTO Customer
                VALUES (
                    '${req.body.username}',
                    '${hashPassword}',
                    N'${req.body.name}',
                    N'${req.body.address}',
                    '${req.body.phone}',
                    '0001'
                )
            `;
            console.log(regQuery);
            const regResult = await new sql.Request().query(regQuery);
            console.log(regResult)

            // Trả về kết quả      
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
 * Nhận request đăng nhập
 * trả về true/báo lỗi
 */
customerRouter.post('/login', async (req, res) => {
    try {
        // Kiểm tra xem đã tồn tại username hay chưa
        const checkQuery = `
            SELECT * FROM Customer
            WHERE Username = '${req.body.username}'
        `;
        // console.log(checkQuery);
        const checkResult = await new sql.Request().query(checkQuery);
        // console.log(checkResult);

        if (!checkResult.rowsAffected[0] || !bcryptjs.compareSync(req.body.password, checkResult.recordset[0].Password)) {
            // Nếu username không tồn tại hoặc mật khẩu sai (giải mã với bcryptjs)
            // thì trả về false và báo lỗi
            res.status(400).json({
                success: false,
                message: "Incorrect Username or Password"
            });
        } else {
            // Nếu đúng username và mật khẩu thì lưu vào session frontend
            req.session.currentUser = {
                username: req.body.username,
                permission: checkResult.recordset[0].Permission
            }

            // Trả về kết quả 
            res.status(200).json({
                success: true,
                message: "Login Success",
                username: req.body.username,
                permission: checkResult.recordset[0].Permission

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

customerRouter.post('/logout', (req, res) => {
    req.session.destroy();
    // Gửi trả thông báo
    res.send({ message: "Logout Success" });
})

/**
 * Nhận request trả về thông tin người dùng
 */
customerRouter.get('/info/:username', async (req, res) => {
    try {
        // Lấy dữ liệu từ database
        const result = await new sql.Request().query(`
            SELECT Name, Address, Phone FROM Customer
            WHERE Username = '${req.params.username}'
        `);
        console.log(result)

        // Trả về kết quả 
        res.status(201).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        // Trả về status500 và lỗi nếu có lỗi trong quá trình giao tiếp với database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
})

module.exports = customerRouter;

