const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        //You can use the select method to "get all except .." too. Just put "-" before the property name
        const user = await User.findOne({ _id: decode._id, tokens: token });

        if (!user)
            throw new Error();
        ;

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send(`You don't have permission.`);
    }
}

module.exports = auth;