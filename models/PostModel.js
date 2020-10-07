const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author: {type: String, required: true, createIndexes: true},
    category: {type: String, required: true},
    upvotes: {type: Number, default: 1},
    downvotes: {type: Number, default: 1},
    content: {type: String, required: true},
    upvoters: {type: [String]},
    downvoters: {type: [String]}
});

module.exports = mongoose.model('Post', postSchema);