/**
 * Hàm này không có tác dùng gì 
 */
module.exports = function isAdministrator(req, res, next) {
    console.log(req.session);
    // if (req.session.currentUser.username != 'admin' || req.session.currentUser.permission != '1111') {
    //     return res.status(403).json({
    //         success: false,
    //         message: "You don't have permission to do this action"
    //     });
    // }
    return next();
}

