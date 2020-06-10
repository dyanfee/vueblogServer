var express = require('express');
var router = express.Router();
var model = require("../model/model")
var { checkToken } = require("../controller/check")

var {
    saveCate, saveTags, savePost, poststat, catestat, tagstat, removeCategory,
    removeTags, removePost, eidtPost, findCates, findTags, findPost, errSend
} = require("../controller/post")

// 保存文章
router.post("/post", checkToken, savePost, saveTags, saveCate, function (req, res) {
    res.send({
        code: 200,
        message: "文章保存成功"
    })
})
// 获取所有blog文章
router.get("/posts", function (req, res) {
    model.Blog.find(function (err, docs) {
        if (err) {
            return res.send({
                code: -200,
                message: "文章获取错误！"
            })
        }
        res.send(docs)
    })
})

// 分页查询
router.get("/postList", poststat, function (req, res) {
    // 每页查询条数
    let num = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    // 查询每页数据15条 
    model.Blog.find().limit(num).skip(num * (page - 1)).exec(function (err, docs) {
        res.send({
            page,
            posts: docs,
            total: req.poststat
        })
    })
})

// 文章统计信息
router.get("/poststat", poststat, catestat, tagstat, function (req, res) {
    res.send({
        poststat: req.poststat,
        catestat: req.catestat,
        tagstat: req.tagstat,
    })
})

// 获取某篇文章
router.get("/post/:id", function (req, res) {
    model.Blog.findOne({ _id: req.params.id }, function (err, docs) {
        if (err) {
            return res.send({
                code: -200,
                message: "未找到相应文章"
            })
        }
        res.send({
            code: 200,
            post: docs
        })
    })
})



// 删除文章
router.post("/post/remove", checkToken, removeCategory, removeTags, removePost,
    function (req, res) {
        res.send({
            code: 200,
            message: "删除成功"
        })
    })




// 修改文章内容
router.post("/post/edit", checkToken, findPost, removeCategory,
    removeTags, saveCate, saveTags, eidtPost,
    function (req, res) {
        res.send({
            code: 200,
            message: "修改成功"
        })
    })



// 展示分类
router.get("/category", findCates, function (req, res) {
    model.Blog.find({ "_id": { "$in": req.category.posts } }, function (err, docs) {
        if (err) return errSend(res, "文章查找错误");
        res.send({
            code: 200,
            posts: docs
        })
    })
})
// 展示标签
router.get("/tag", findTags, function (req, res) {
    model.Blog.find({ "_id": { "$in": req.tag.posts } }, function (err, docs) {
        if (err) return errSend(res, "文章查找错误");
        res.send({
            code: 200,
            posts: docs
        })
    })
})
// 所有分类
router.get("/allCategories", function (req, res) {
    model.Category.find(function (err, docs) {
        if (err) return errSend(res, "查询错误");
        res.send({
            code: 200,
            categories: docs
        })
    })
})
// 所有标签
router.get("/allTags", function (req, res) {
    model.Tag.find(function (err, docs) {
        if (err) return errSend(res, "查询错误");
        res.send({
            code: 200,
            tags: docs
        })
    })
})

module.exports = router