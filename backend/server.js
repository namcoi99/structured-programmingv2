const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const customerRouter = require('./routes/customers.routes');
const productRouter = require('./routes/products.routes');
const uploadRouter = require('./routes/upload.routes');
const orderRouter = require('./routes/orders.routes');
const cartRouter = require('./routes/cart.routes');
const filterRouter = require('./routes/filter.routes');
const adminRouter = require('./routes/admin.routes');

// TODO: for Admin function
// const isLoggedIn = require('./middleware/checkLogIn');
// const isAdmin = require('./middleware/checkPermission');

const config = {
    user: 'tung',
    password: 'tung',
    server: 'localhost',
    database: 'WebCSDL',
    options: {
        encrypt: false,
    }
};
sql.connect(config, (err, pool) => {
    if (err) console.log(err);
    else {
        console.log("SQL Server Connected...");

        const app = express();

        app.use(express.static('public'));
        // cho phép client gọi 1 api từ 1 nguồn khác có domain khác với trang hiện tại
        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
        }));
        app.use(bodyParser.json());
        app.use(morgan('tiny'))

        // Lưu dữ liệu session
        app.use(session({
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: false
        }));

        app.get('/test', (req, res) => {
            console.log(req.session.currentUser);
            res.send(req.session.currentUser);
            // new sql.Request().query('SELECT * FROM Users', (err, result) => {
            //     if (err) console.log(err);
            //     else {
            //         console.log(result);
            //         res.send(result);
            //     }
            // });
        });

        // route
        app.use('/customer', customerRouter);
        app.use('/product', productRouter);
        app.use('/filter', filterRouter);
        app.use('/upload', uploadRouter);
        app.use('/order', orderRouter);
        app.use('/cart', cartRouter);
        app.use('/admin', adminRouter);

        app.listen(process.env.PORT || 5000, (err) => {
            if (err) throw err;
            else console.log("Server listen on port 5000...");
        });
    }
});

sql.on('error', err => {
    // error handler
});