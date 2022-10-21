const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user:{type: String,required: true},
    comment:{type: String,required: true},
    postId:{type: String,required: true},
    date:{type: Date,default: Date.now}
});
commentSchema.virtual("date_formated").get(()=>{
    return this.date.toLocaleDateString("en-gb",{
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minutes: "2-digit",
    });
});
module.exports = mongoose.model("Comments",commentSchema);