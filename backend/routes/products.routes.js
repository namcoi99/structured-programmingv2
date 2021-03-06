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
        // L???y d??? li???u t??? CSDL
        // (optional) t??m ki???m c??c s???m ph???m c?? t??n ch???a t??? kh??a
        const viewQuery = `
            SELECT * FROM Product
            ${req.query.keyword ? ("WHERE Name LIKE N'%" + req.query.keyword + "%'") : ''}
            ORDER BY ${req.query.sortField ? req.query.sortField : 'Sold'} ${req.query.sortDirection > 0 ? 'ASC' : 'DESC'}
            OFFSET ${(req.query.pageNumber - 1) * req.query.pageSize} ROWS  
            FETCH NEXT ${req.query.pageSize} ROWS ONLY
            `
        console.log(viewQuery);
        const viewResult = await new sql.Request().query(viewQuery);

        // ?????m t???ng s??? s???n ph???m (th???a m??n y??u c???u)
        const total = await new sql.Request().query(
            `
            SELECT COUNT(*) AS Total FROM Product
            ${req.query.keyword ? ("WHERE Name LIKE '%" + req.query.keyword + "%'") : ''}
            `
        );
        
        // Tr??? v??? k???t qu???
        res.status(201).json({
            success: true,
            data: {
                total: total.recordset[0].Total,
                recordset: viewResult.recordset
            }
        });
    } catch (err) {
        // Tr??? v??? status500 v?? l???i n???u c?? l???i trong qu?? tr??nh l???y d??? li???u t??? database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nh???n request tr??? v??? 
 * 8 s???n ph???m c?? s??? l?????ng b??n ra nhi???u nh???t (best seller)
 * trong t???ng s??? t???t c??? s???n ph???m
 * ho???c trong 1 category (optional)
 */
productRouter.get('/best-seller', async (req, res) => {
    try {
        // L???y d??? li???u t??? CSDL
        // (optional) N???u c?? y??u c???u v??? category c??? th??? th?? ch??? l???y c??c ph???m trong category ????
        const result = await new sql.Request().query(`
            SELECT TOP 8 * FROM Product
            ${req.query.category ? ("WHERE Category LIKE 'N" + req.query.category + "'") : ''}
            ORDER BY Sold DESC
        `);

        // Tr??? v??? k???t qu???
        res.status(201).json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        // Tr??? v??? status500 v?? l???i n???u c?? l???i trong qu?? tr??nh l???y d??? li???u t??? database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nh???n request tr??? v??? 
 * th??ng tin s???n ph???m theo ID
 */
productRouter.get('/:productID', async (req, res) => {
    try {
        // Ki???m tra s???n ph???m c?? t???n t???i hay kh??ng
        const result = await new sql.Request().query(`
            SELECT * FROM Product
            WHERE ProductID = '${req.params.productID}'
        `);

        // N???u kh??ng t???n t???i th?? tr??? v??? l???i
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
        // Tr??? v??? status500 v?? l???i n???u c?? l???i trong qu?? tr??nh l???y d??? li???u t??? database
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Nh???n request x??a s???n ph???m trong CSDL
 * tr??? v??? true/b??o l???i
 */
productRouter.delete('/:id', async(req, res) => {
    try {
        // X??a s???n ph???m  trong CSDL
        const result = await new sql.Request().query(`
            DELETE FROM Product
            WHERE ProductID = '${req.params.id}'
        `);

        // B??o l???i n???u kh??ng t???n t???i s???n ph???m trong CSDL
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
        // Tr??? v??? status500 v?? l???i n???u c?? l???i trong qu?? tr??nh giao ti???p v???i database
        res.status(500).json({
            success: false,
        });
    }
})

module.exports = productRouter;