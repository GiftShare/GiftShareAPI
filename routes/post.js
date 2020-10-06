const express = require("express");
const router = express.Router();
const postModel = require("../models/PostModel");
const mongoose = require("mongoose");
const checkAuth = require("../util/checkauth");
const jwt = require("jsonwebtoken");
const categories = ["kategoria", "kategoria1"]
function checkCategory(cat) {
    return categories.includes(cat);
}

router.post('/create', checkAuth, (req, res, next) => {
    const author = jwt.decode(req.body.token, "secret2137");
    // console.log(author.userID);
    // console.log(author.username);
    // console.log(author.email);
    // console.log(author.karma);
    const post = new postModel({
        "author": author.username,
        "category": req.body.category,
        "content": req.body.content
    })
    if(req.body.content.length >= 200) {
        return res.status(200).json({
            "result": "Za długi post."
        });
    }else {
        if (checkCategory(req.body.category)) {
            post.save().then(result => {
                return res.status(200).json({
                    "result": "Utworzono post."
                });
            })
        } else {
            return res.status(200).json({
                "result": "Zła kategoria."
            });
        }
    }
});

router.get('/get', checkAuth, (req, res, next) => {
    postModel.findById({"_id": req.body.id}).exec().then(post => {
        res.status(200).json({
            "author": post.author,
            "content": post.content,
            "upvotes": post.upvotes,
            "downvotes": post.downvotes
        });
    }).catch(err => {
        if(err) {
            res.status(500).json({
                "err": err
            });
        }
    });
});

module.exports = router;