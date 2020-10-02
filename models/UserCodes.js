const mongoose = require('mongoose');

const codesSchema = mongoose.Schema({
    email: {type: String, required: true, createIndexes: true},
    code: {type: Number, required: true}
});

module.exports = mongoose.model('VerifyCodes', codesSchema);