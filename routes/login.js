const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const app = require("../app");
const bcrypt = require('bcrypt');

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
                                            const user = new userModel({
                                                username: req.body.username,
                                                email: req.body.email,
                                                password: hash
                                            })
                                            if (mongoose)
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

module.exports = router;