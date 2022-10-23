const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {type: String, required: true, maxLength: 20},
    password:{type: String, required: true},
    posts:[{type: Schema.Types.ObjectId, ref: 'Post'}]
})

module.exports = mongoose.model("User",userSchema);