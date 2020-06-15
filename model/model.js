
require("../model");
var mongoose = require("mongoose")
var bcrypt = require("bcrypt")
var Schema = mongoose.Schema;

var UsersSchema = Schema({
    name: { type: String, unique: true },
    password: {
        type: String,
        set(val) {
            return bcrypt.hashSync(val, 10)
        }
    },
    logintime: { type: Date, default: Date.now }
});

const Users = mongoose.model('User', UsersSchema);

// User.db.dropCollection("users")

var blogSchema = Schema({
    title: String,
    author: String,
    category: String,
    tags: [{ type: String }],
    body: String,
    // comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    // hidden: Boolean,
    // meta: {
    //     votes: Number,
    //     favs: Number
    // }
});

const Blog = mongoose.model('Blog', blogSchema);

// 分类模型
var CategorySchema = Schema({
    category: String,
    posts: [{ type: Schema.Types.ObjectId, ref: "Blog" }]
})

const Category = mongoose.model("Category", CategorySchema);

// 标签模型
var TagsSchema = Schema({
    tag: String,
    posts: [{ type: Schema.Types.ObjectId, ref: "Blog" }]
})

const Tag = mongoose.model("Tag", TagsSchema);

// 评论
var CommentSchema = Schema({
    post: { type: Schema.Types.ObjectId, ref: "Blog" },
    user: String,
    content: String,
    date: { type: Date, default: Date.now },
    replay: [{
        fromuser: String,
        touser: String,
        content: String,
        date: { type: Date, default: Date.now },
    }]
})

const Comments = mongoose.model("Comments", CommentSchema);

module.exports = { Users, Blog, Category, Tag, Comments };
