var express = require('express');
var router = express.Router();
var model = require("../model/model");
var { getComments } = require("../middleware/comment")
var { checkToken } = require("../middleware/check");

var errSend = function (response, message, code) {
    if (!code) code = -200;
    response.send({
        code,
        message
    })
}

// 添加评论
router.post("/comment", function (req, res) {
    // 带评论id就是回复评论
    if (req.body.commentId) {
        model.Comments.updateOne({ "_id": req.body.commentId },
            { $addToSet: { "replay": req.body.replay } },
            function (err, docs) {
                if (err) return errSend(res, "评论回复错误！")
                if(docs.nModified==0)return errSend(res, "没找到评论！")
                res.send({
                    code: 200,
                    message: "评论回复成功！",
                    docs
                })
            })
    }
    // 否则是评论文章
    else {
        new model.Comments(req.body).save(function (err, docs) {
            if (err) {
                return errSend(res, "评论保存错误！")
            }
            res.send({
                code: 200,
                message: "评论保存成功！",
                docs
            })
        })
    }
})

// 查询评论
router.get("/comment", getComments, function (req, res, next) {
    if (req.comments) {
        res.send({
            code: 200,
            message: "查询评论成功",
            comments: req.comments
        })
    } else {
        res.send({
            code: -200,
            message: "没有找到评论"
        })
    }
})


module.exports = router;