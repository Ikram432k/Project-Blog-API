const { body,validationResult } = require("express-validator");
const Post = require("../modals/postmodal");
const User = require("../modals/usermodal");

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
        if (!posts) {
          return res.status(404).json({ err: "posts not found" });
        }
        res.status(200).json({ posts });
      } catch (err) {
        next(err);
      }
}
exports.singlePost = async(req,res,next)=>{
    try{
       const post = await Post.findById({_id:req.params.postid})
       .populate('author',{username: 1})
       console.log(post);
       if(!post || post.length == 0){
        return res.status(403).json({message: "no post available from this author"});
       } 
       return res.status(200).json({post});
    }catch(error){
        return res.status(403).json({message: "post does not exists"});
    }
}

exports.postVisibility =(req,res)=>{
    res.send("not implemented");
}