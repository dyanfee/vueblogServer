// 中间件 用于验证用户等
require("dotenv").config()
var model = require("../model/model");
var jwt = require("jsonwebtoken");
var screctId = process.env.SCRECTS;
const checkToken = async function (req, res, next) {
    if (!req || !req.headers || !req.headers.authorization) {
        return res.status(422).send({
            code: 422,
            message: "需要登陆"
        })
    }
    const raw = String(req.headers.authorization).split(' ').pop();
    const { id } = jwt.verify(raw, screctId);
    if (!id) {
        return res.status(422).send({
            code: 422,
            message: "token参数错误"
        })
    }
    const user = await model.Users.findById(id);
    if (!user) {
        return res.status(422).send({
            code: 422,
            message: "user参数错误"
        })
    }
    req.user = user;
    next()
}

module.exports = {
    checkToken
}