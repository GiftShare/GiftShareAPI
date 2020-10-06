const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const app = require("../app");
const checkAuth = require("../util/checkauth.js");

router.get("/info/:username", checkAuth, (req, res, next) => {
    userModel.findOne({username: new RegExp('^'+req.params.username+'$', "i")}).exec().then(user => {
        res.status(200).json({
            "result": {
                id: user._id,
                username: user.username,
                karma: user.karma
            }
        });
    }).catch(err => {
        res.status(404).json({
            "error": "Nie ma takiego użytkownika"
        });
    });
});

module.exports = router;