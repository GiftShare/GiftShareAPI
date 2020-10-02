const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const codesModel = require("../models/UserCodes");
const mongoose = require("mongoose");
const app = require("../app");
const bcrypt = require('bcrypt');
const mail = require("../util/MailUtils");

function isUsernameValid(v) {
    var re = /^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$/;
    return (v == null || v.trim().length < 1) || re.test(v)
}

function isEmailValid(v) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return (v == null || v.trim().length < 1) || re.test(v)
}

router.post('/register', (req, res, next) => {
    userModel.find({username: req.body.username})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    error: "Użytkownik z takim nickiem już istnieje."
                });
            }else {
                userModel.find({email: req.body.email})
                    .exec()
                    .then(user => {
                        if (user.length >= 1) {
                            return res.status(409).json({
                                error: "Użytkownik z takim adresem email już istnieje."
                            });
                        } else {
                            if (isUsernameValid(req.body.username)) {
                                if (isEmailValid(req.body.email)) {
                                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                                        if (err) {
                                            return res.status(500).json({
                                                "error": err
                                            })
                                        } else {
                                            let code = Math.floor(Math.random()*90000) + 10000
                                            const user = new userModel({
                                                username: req.body.username,
                                                email: req.body.email,
                                                password: hash
                                            })
                                            if (mongoose)
                                            typeof mail.sendVerificationEmail(req.body.email, req.body.username, code);
                                            const userCode = new codesModel({
                                                email: req.body.email,
                                                code: code
                                            })
                                            userCode.save();
                                            user.save().then(result => {
                                                res.status(200).json({
                                                    status: "Użytkownik zarejestrowany."
                                                });
                                            }).catch();
                                        }
                                    });
                                } else {
                                    res.status(409).json({
                                        "error": "Adres email jest w niepoprawnym formacie."
                                    });
                                }
                            }
                        }

                    })
                    .catch()
            }
        });
});

router.post('/verifyaccount/:email/:code', (req, res, next) => {
    codesModel.findOne({email: new RegExp('^'+req.params.email+'$', "i")}).exec().then(user => {
        if(req.params.code == user.code) {
            userModel.findOne({email: new RegExp('^'+req.params.email+'$', "i")}).exec().then(userc => {
                userc.verified = true;
                userc.save();
                res.status(200).json({
                    "result": "Potwierdzono adres email."
                });
                user.delete();
                typeof mail.sendEndingMail(req.params.email);
            }).catch(err => {
                res.status(500).json({
                    "error": err
                });
            });
        }else {
            res.status(500).json({
                "result": "Zły kod."
            });
        }
    }).catch(err => {
        res.status(500).json({
            "error": "Zły adres email."
        });
    });
});

module.exports = router;