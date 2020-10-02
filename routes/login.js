const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const codesModel = require("../models/UserCodes");
const mongoose = require("mongoose");
const app = require("../app");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

function sendVerificationEmail(target, username, code) {
    let testAccount = nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {

        },
    });
    let info = transporter.sendMail({
        from: '"Giftshare" <giftshare1@gmail.com>', // sender address
        to: target + ', ' + target, // list of receivers
        subject: "Verify your Giftshare account! ✔", // Subject line
        text: "Verify your Giftshare account! ✔", // plain text body
        html: "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <style>\n" +
            "        .main {\n" +
            "            width: 201px;\n" +
            "            height: 251px;\n" +
            "            margin: 0 auto;\n" +
            "        }\n" +
            "        .logo {\n" +
            "            width: 200px;\n" +
            "            height: 200px;\n" +
            "        }\n" +
            "    </style>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <div class=\"main\">\n" +
            "        <h1 style=\"font-family: 'Microsoft JhengHei Light'; text-align: center;\">Verify your Giftshare account!</h1>\n" +
            "        <img class=\"logo\" src=\"https://raw.githubusercontent.com/vjasieg/GiftShare/master/Logo.png\"/>\n" +
            "    </div>\n" +
            "    <h2 style=\"font-family: 'Microsoft JhengHei Light'; text-align: center; margin-top: 120px;\">Hi, " + username + "! Your verification code is: " + code + "</h2>\n" +
            "</body>\n" +
            "</html>", // html body
    });
}

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
                                            sendVerificationEmail(req.body.email, req.body.username, code);
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

module.exports = router;