var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require("../controllers/userController");
const Post = require("../controllers/postController");
const Comment = require("../controllers/commentController");
/* GET home page. */
/* index route*/
router.get("/", function (req, res, next) {
    res.redirect("/api/posts");
  });
/************* User login,signup,logout **************/ 

// login author - api/login
router.post("/login", User.login);

//logout auhtor - api/logout
router.post("/logout", User.logout);

// create author - api/signup
router.post("/signup", User.signIn);

/************ CURD opertion of Post **************/

// view all posts
router.get("/posts",Post.postList);

// view single post only
router.get("/posts/postid",Post.singlePost);

// create post for author - api/post
router.post('/posts', passport.authenticate('jwt', {session: false}), Post.createPost);

// updated single post
router.post('/posts/:postid/update',passport.authenticate('jwt', {session: false}), Post.singlePostUpdated);

// delete single post
router.post('/posts/:postid/delete',passport.authenticate('jwt', {session: false}),Post.DeleteSinglePost);

/********** CURD operation on comments**********/

// create comment on post - api/posts/:postid/comments
router.post('/posts/:postid/comment',Comment.createComment);

// view all the comment on single post -api/posts/postid
router.get('/posts/:postid/postComments',Comment.commentsOnpost);

// delete comment on post -api/posts/postid/comments/commentid
router.post('/posts/:postid/comment/:commentid',Comment.commentDelete);

// // update comment on the post by author -api/posts/postid/commentid
// router.post('/comment/:commentid' ,Comment.commentsUpdates);
module.exports = router;
