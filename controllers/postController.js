const { body,validationResult } = require("express-validator");
const Post = require("../modals/postmodal");
const User = require("../modals/usermodal");
const Comment = require("../modals/commentmodal");
exports.createPost = [
    body('title').trim().isLength({min:1}).withMessage("title must not be empty"),
    body('text').trim().isLength({min:1}).withMessage("text must not be empty"),
    async(req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.status(403).json({
                error: errors.array(),
                data: req.body
            });
        }
        try{
            const post = new Post({
                author: req.user._id,
                title: req.body.title,
                text: req.body.text  
            })
            post.save(err=>{
                if(err){
                    return next(err);
                }
                res.status(200).json({post,token:req.user})
            })
            await User.findOneAndUpdate(
                {_id:post.author},
                {$push:{posts:post}}
            )
        }catch(error){
            res.status(403).json({err});
        }
    }
]

exports.postList = async(req,res,next)=>{
    try {
        const posts = await Post.find({}).populate('author', {username: 1, _id: 0});
        posts.sort((a, b) => b.date - a.date);
        if (!posts) {
          return res.status(404).json({ err: "posts not found" });
        }
        res.status(200).json({ posts });
      } catch (err) {
        next(err);
      }
}

exports.postOfUser =async(req,res,next)=>{
    try{
        const posts = await Post.find({author: req.params.userid}).populate('author', {username: 1, _id: 0});
        if(!posts){
            return res.status(200).json({message: "no posts available"})
        }
        return res.status(200).json({posts});
    }catch(error){
        return next(error);
    }
}
exports.singlePost = async(req,res,next)=>{
    try{
       const post = await Post.findById({_id:req.params.postid})
       .populate('author',{username: 1})
       console.log(post);
       if(!post){
        return res.status(403).json({message: "no post available from this author"});
       } 
       res.status(200).json({post});
    }catch(error){
        return res.status(403).json({message: "post does not exists"});
    }
}

exports.singlePostUpdated = async(req,res,next)=>{
    try{
        if(req.user){
            const post = await Post.findByIdAndUpdate(req.params.postid,{
                title: req.body.title,
                text: req.body.text
            });
            if(!post){
                return res.status(403).json({message: "no post available from this id"});
            }
            res.status(200).json({message:`post with ${req.params.postid} id is updated`,post: post});
        }
    }catch(error){
        return next(error);
    }
}
//shoud also delete the post id from the user 
exports.DeleteSinglePost = async(req,res,next)=>{
    try{
        if(req.user){
            const post = await Post.findByIdAndDelete({_id:req.params.postid});
            if(!post){
                return res.status(403).json({message: "no post available from this id"});
            }
            const deleteFromuser = await User.findOneAndUpdate({
                _id:req.user._id
            },
            {$pull:{
                posts: req.params.postid
            }})
            const deletedComments = await Comment.deleteMany({postId:req.params.postid});
            res.status(200).json({message:`post with ${req.params.postid} id is deleted`,post: post,comments:deletedComments});
        }
    }catch(error){
        return next(error);
    }
}
exports.postVisibility =(req,res)=>{
    res.send("not implemented");
}