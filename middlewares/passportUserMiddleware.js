const { User } = require("../models/user");
const passportUserMiddleware = async (req, res, next) => {
    if (req.session.passport && req.session.passport.user) {
        const user = await User.findById(req.session.passport.user);
        res.locals.user = user;
        req.user = user;
    } else {
        res.locals.user = null;
        req.user = null;
    }

    next();
};

module.exports = { passportUserMiddleware };