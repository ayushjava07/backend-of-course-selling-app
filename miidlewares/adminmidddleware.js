const jwt = require('jsonwebtoken');
const adminmiddleware = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const verify = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

        if (verify) {
            req.AdminId=verify.AdminId;
            next();
        }
        else {
            res.status(404).json({
                messsage: "u are not signed in"
            })
        }
    } catch (error) {
        res.json({
            messsage: "something went wrong"
        })
    }

}
module.exports = adminmiddleware;