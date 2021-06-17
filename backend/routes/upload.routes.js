const express = require('express');
// middleware cho nodejs xử lý dữ liệu dạng multipart/form-data 
// khi người dùng upload file
const multer = require('multer');
//hỗ trợ bắt file, thư viện nhận file từ fe
const path = require('path');

// Router này dùng để upload ảnh khi tạo/update sản phẩm
const uploadRouter = express.Router();

/**
 * destination: xác định vị trí lưu trữ cho các tệp
 * filename: mẫu tên file = Date_filename
 */
const storage = multer.diskStorage({ //multers disk storage settings
    destination: './public/image/products',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
});

/**
 * multer settings
 * fileFilter: chỉ cho phép file png/jpg/gif/jpeg
 * limit: giới hạn kích thước file
 */
const upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'));
        }
        else return cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 1024
    },
});

// upload.field for upload more fields
uploadRouter.post('/', upload.single('image'), async (req, res, err) => {
    console.log(req.file);
    // handle err ??? how 
    res.status(200).json({
        success: true,
        data: req.file.filename,
        session: req.session
    });
});

module.exports = uploadRouter;