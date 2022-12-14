const mongoose = require("mongoose");
const { schema } = require("./usermodal");
// const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    author:{type: Schema.Types.ObjectId,ref:"User"},
    comments:[{type: Schema.Types.ObjectId,ref:"Comments"}],
    title:{type: String, required: true ,maxLengt:100},
    text:{type: String, required: true, maxLength:500},
    timestamp:{type: Date, default: Date.now ,required:true},
    publish:{type: Boolean, default: false}
});
postSchema.virtual("timestamps").get(()=>{
    return this.date.toLocaleDateString("en-gb",{
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minutes: "2-digit",
    });
});
module.exports = mongoose.model("Post",postSchema);
