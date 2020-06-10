require("dotenv").config()
// 用于管理用户路由
var express = require('express');
var router = express.Router();
var model = require("../model/model");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var check = require("../controller/check")


// 查询所有用户
router.get("/users", function (req, res) {
    model.Users.find((err, docs) => {
        if (err) {
            console.log("查询用户错误！");
            return
        }
        res.send(docs)
    })
})

// 创建用户 注册
// router.post("/register", function (req, res) {
//     new model.Users(req.body).save(function (err, user) {
//         if (err) {
//             // TODO捕获错误原因
//             res.status(422).send("用户创建失败！")
//             return
//         }
//         res.send(user)
//     })
// })

// 用户登录
router.post("/login", async function (req, res) {
    const user = await model.Users.findOne({ name: req.body.name })
    if (!user) {
        return res.send({
            code: -200,
            message: "用户不存在"
        })
    }
    console.log(req.body.password, user.password);

    // 判断密码是否正确
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.send({
            code: -200,
            message: "账号或密码错误"
        })
    }
    // 创建token
    const exp = new Date();
    exp.setDate(exp.getDate() + 7);
    const token = jwt.sign({
        id: String(user._id),
        exp: parseInt(exp.getTime() / 1000)
    }, process.env.SCRECTS)
    // 登录成功
    res.send({
        code: 200,
        userId: String(user._id),
        token: token
    })
})

// 用户信息接口
router.get("/profile", check.checkToken, async function (req, res) {

    res.send(req.user)
})

module.exports = router;