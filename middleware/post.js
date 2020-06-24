var model = require("../model/model")


var saveCb = function (err, doc) {
    if (err)
        return console.log(doc, "保存失败");

}
var errSend = function (response, message, code) {
    if (!code) code = -200;
    response.send({
        code,
        message
    })
}


/** 加入文章分类 */
var saveCate = function (req, res, next) {
    if (req.post.category)
        model.Category.findOne({ "category": req.post.category }, function (err, docs) {
            if (err) {
                return errSend(res, "分类失败");
            }
            if (!docs) {
                new model.Category({
                    category: req.post.category,
                    posts: [req.post._id]
                }).save(function (err, cate) {
                    if (err) {
                        return errSend(res, "分类保存失败");
                    }
                })
            } else {
                docs.posts.push(req.post._id);
                docs.save(saveCb)
            }
            next()
        })
    else
        next()
}
/** 加入标签 */
var saveTags = function (req, res, next) {
    if (req.post.tags) {
        for (let i = 0; i < req.post.tags.length; i++) {
            let value = req.post.tags[i];
            model.Tag.findOne({ "tag": value }, function (err, docs) {
                if (err) {
                    errSend(res, "标签查询失败", value);
                    return
                }
                if (!docs) {
                    new model.Tag({
                        tag: value,
                        posts: [req.post._id]
                    }).save(function (err, tag) {
                        if (err) return errSend(res, '标签保存失败');
                    })
                } else {
                    docs.posts.push(req.post._id);
                    docs.save(saveCb)
                }
                next()
            })
        }
    }
    else
        next()
}
const savePost = function (req, res, next) {
    // TODO 验证用户
    new model.Blog(req.body).save(function (err, post) {
        if (err) {
            return res.status(500).send("文章保存错误！")
        }
        // 将文章挂载到req上
        req.post = post;
        next()
    })
};

/** 文章数量统计 */
const poststat = async function (req, res, next) {
    await model.Blog.find().estimatedDocumentCount(function (err, count) {
        req.poststat = count || 0;
        next()
    });
}
/** 文章分类数量统计 */
const catestat = async function (req, res, next) {
    await model.Category.find().estimatedDocumentCount(function (err, count) {
        req.catestat = count || 0;
        next()
    });
}
/** 文章标签数量统计 */
const tagstat = async function (req, res, next) {
    await model.Tag.find().estimatedDocumentCount(function (err, count) {
        req.tagstat = count || 0;
        next()
    });
}
const removeCategory = async function (req, res, next) {
    if (req.body && req.body.category) {
        await model.Category.updateOne({ "category": req.body.category }, { '$pull': { "posts": req.body._id } }, function (err, docs) {
            if (err) {
                console.error("分类删除失败", err);
            }
        })
    }
    next()
}
const removeTags = async function (req, res, next) {
    if (req.body && req.body.tags)
        await model.Tag.updateMany({ "tag": { $in: req.body.tags } }, { '$pull': { "posts": req.body._id } }, function (err) {
            if (err) console.error("标签删除失败", err);
        })
    next()
}
const removePost = async function (req, res, next) {
    await model.Blog.remove({ _id: req.body._id }, function (err) {
        if (err) console.error("删除失败");
    })
    next()
}

const eidtPost = async function (req, res, next) {
    model.Blog.updateOne({ "_id": req.post._id }, {
        "title": req.post.title,
        "category": req.post.category,
        "tags": req.post.tags,
        "author": req.post.author,
        "body": req.post.body,
    }, function (err, docs) {
        if (err) errSend(res, "修改文章失败");
    })
    next()
}

const findCates = function (req, res, next) {
    model.Category.findOne({ "category": req.query.category }, function (err, docs) {
        if (err) return errSend(res, "未找到对应分类");
        if (docs && docs.posts && docs.posts.length != 0) {
            req.category = docs
            next()
        } else {
            res.send({
                code: -200,
                message: "该分类暂无文章"
            })
        }
    })
}
const findTags = function (req, res, next) {
    model.Tag.findOne({ "tag": req.query.tag }, function (err, docs) {
        if (err) return errSend(res, "未找到对应标签");
        if (docs && docs.posts && docs.posts.length != 0) {
            req.tag = docs
            next()
        } else {
            return res.send({
                code: -200,
                message: "该标签暂无文章"
            })
        }
    })
}

const findPost = async function (req, res, next) {
    await model.Blog.findOne({ "_id": req.body._id }, function (err, docs) {
        if (err) return errSend(res, "文章查询错误");
        req.post = req.body;
        req.body = docs
    })
    next()
}
module.exports = {
    saveCate,
    saveTags,
    savePost,
    poststat,
    catestat,
    tagstat,
    removeCategory,
    removeTags,
    removePost,
    eidtPost,
    findCates,
    findTags,
    findPost,
    errSend
}