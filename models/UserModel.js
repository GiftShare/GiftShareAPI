const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true, createIndexes: true},
    verified: {type: Boolean, default: false},
    email: {
        type: String, required: true, createIndexes: true
    },
    password: {type: String, required: true},
    karma: {type: Number, default: 10},

});

module.exports = mongoose.model('User', userSchema);