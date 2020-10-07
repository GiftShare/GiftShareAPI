const express = require("express");
const router = express.Router();
const postModel = require("../models/PostModel");
const mongoose = require("mongoose");
const checkAuth = require("../util/checkauth");
const jwt = require("jsonwebtoken");
const categories = ["kategoria", "kategoria1"]
const token = require('../util/token');

function checkCategory(cat) {
    return categories.includes(cat);
}

router.post('/create', checkAuth, (req, res, next) => {
    const author = jwt.decode(req.body.token, "secret2137");
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

router.get('/get/:postID', checkAuth, (req, res, next) => {
    postModel.findById({"_id": req.params.postID}).exec().then(post => {
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

router.post('/delete/:postID', checkAuth, (req, res, next) => {
    postModel.findById({"_id": req.params.postID}).exec().then(post => {
        const author = token.getAttribute(req.body.token);
        if(post.author === author.username) {
            post.delete();
            return res.status(200).json({
                "result": "Usunięto post."
            });
        }else if(author.role === "Administrator") {
            post.delete();
            return res.status(200).json({
                "result": "Usunięto post."
            });
        }else {
            return res.status(403).json({
                "result": "Nie masz uprawnień."
            });
        }
    }).catch(err => {
        console.log(err);
    })
});

router.post('/edit/:postID', checkAuth, (req, res, next) => {
    postModel.findById({"_id": req.params.postID}).exec().then(post => {
        const author = token.getAttribute(req.body.token);
        if(post.author === author.username) {
            post.content = req.body.content;
            post.save();
            return res.status(200).json({
                "result": "Zedytowano post."
            });
        }else if(author.role === "Administrator") {
            post.content = req.body.content;
            post.save();
            return res.status(200).json({
                "result": "Zedytowano post."
            });
        }else {
            return res.status(403).json({
                "result": "Nie masz uprawnień."
            });
        }
    }).catch(err => {
        console.log(err);
    })
});

router.post('/upvote/:postID', checkAuth, (req, res, next) => {
    postModel.findById({"_id": req.params.postID}).exec().then(post => {
        const author = token.getAttribute(req.body.token);
        post.upvoters.push(author.username);
        post.upvotes = post.upvotes + 1;
        post.save();
        return res.status(200).json({
            "result": "Upvote dodany"
        });
    }).catch();
});

router.post('/downvote/:postID', checkAuth, (req, res, next) => {
    postModel.findById({"_id": req.params.postID}).exec().then(post => {
        const author = token.getAttribute(req.body.token);
        post.push(author.username);
        post.upvotes = post.upvotes + 1;
        post.save();
        return res.status(200).json({
            "result": "Upvote dodany"
        });
    }).catch();
});

module.exports = router;