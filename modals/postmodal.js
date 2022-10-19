const mongoose = require("mongoose");
const { schema } = require("./usermodal");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref:"User", required: true},
    title:{type: String, required: true ,maxLengt:100},
    text:{type: String, required: true, maxLength:500},
    comments:{type: Schema.Types.ObjectId, ref:"Comments"},
    timestamp:{type: Date, default: Date.now ,required:true}
});
postSchema.virtual("date").get(()=>{
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});
module.exports = mongoose.model("Post",postSchema);
