const { body,validationResult } = require("express-validator");
const Post = require("../modals/postmodal");
const Comment = require("../modals/commentmodal");

exports.createComment = [
    body('comment').trim().isLength({min:1}).withMessage("commnet must not be empty"),
    async(req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty){
            res.status(403).json({
                error:errors.array(),
                data: req.body
            });
        }
        try{
            const comment = new Comment({
                comment: req.body.comment,
                // user: req.user._id,
                postId: req.params.postId
            })
            comment.save(err=>{
                if(err){
                    return next(err);
                }
                res.status(200).json({message:"comment saved",comment});    
            })
            await Post.findOneAndUpdate(
                {_id: req.params.postid},
                {$push: {comments: comment}}
            )
        }catch(error){
            res.status(403).json({error});
        }
    }
];

exports.commentsOnpost = async(req,res,next)=>{
    try{
        // const comments = await Comment.find({},{title: 1, text: 1, timestamp: 1 })
        // .populate('author', {username: 1, _id: 0})
        const comments = await Comment.find({postId: req.params.postid})
        if(!comments || comments.length==0){
            return res.status(403).json({message: "no comments available"})
        }
        return res.status(200).json(comments)
    }catch(error){
        return next(error);
    }
}

exports.commentDelete =(req,res)=>{
    res.send("not implemented");
}