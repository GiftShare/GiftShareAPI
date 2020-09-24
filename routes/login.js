const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const mongoose = require("mongoose");
const app = require("../app");
const bcrypt = require('bcrypt');

router.post('/register', (req, res, next) => {
    userModel.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length >= 1) {
                return res.status(409).json({
                    error: "Użytkownik z takim adresem email już istnieje."
                });
            }else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            "error": err
                        })
                    }else {
                        const user = new userModel({
                            email: req.body.email,
                            password: hash
                        })
                        if(mongoose)
                            user.save().then(result => {
                                res.status(400).json({
                                    status: "Użytkownik zarejestrowany."
                                });
                            }).catch();
                    }
                });
            }
        })
        .catch()
});

module.exports = router;