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
                postId: req.params.postid
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
        const comments = await Comment.find({postId: req.params.postid})
        if(!comments || comments.length==0){
            return res.status(403).json({message: "no comments available"})
        }
        return res.status(200).json(comments)
    }catch(error){
        return next(error);
    }
};

exports.commentDelete = async(req,res,next)=>{
    try{
        const comment = await Comment.findByIdAndDelete(req.params.commentid);
        if(!comment){
            res.status(403).json({message:`no comment find by ${req.params.commentid}`});
        }
        else{
            const deleteFrompost = await Post.findOneAndUpdate({
                _id:req.params.postid
            },
            {$pull:{
                comment: req.params.postid
            }})
            return res.status(200).json({message: "comment deleted",comment:comment})
        }
    }catch(err){
        return next(err);
    }
};