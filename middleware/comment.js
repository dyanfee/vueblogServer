var model = require("../model/model")

// 获取评论by postid
const getComments = function (req, res, next) {
    if (req.query.comments && req.query.id)
        model.Comments.find({ post: req.query.id }, function (err, docs) {
            req.comments = docs
            // console.log(docs);
            next()
        })
    else
        next()
}

module.exports = {
    getComments
}