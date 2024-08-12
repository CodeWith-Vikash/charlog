const express = require('express');
const router = express.Router();
const postModel = require('../models/PostModel');

// route to get all posts
router.get('/posts', async (req, res) => {
    try {
        const data = await postModel.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching posts', error });
    }
});

// route to add a post
router.post('/posts', async (req, res) => {
    const { userInfo, title, media, likes, comments } = req.body;
    try {
        const postedData = new postModel({
            userInfo,
            title,
            media,
            likes,
            comments
        });
        const savedPost = await postedData.save();
        res.status(201).json({ message: 'Post saved', data: savedPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error while posting', error });
    }
});

// route to comment on a post
router.patch('/post/:id/comment', async (req, res) => {
    const { username, avatar, comment,userId } = req.body;
    const id = req.params.id;
    try {
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json('Post not found');
        }
        post.comments.unshift({ username, avatar, comment,userId });
        const updatedData = await post.save();
        res.status(200).json({ message: 'Update success', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating post', error });
    }
});

// route to delete a comment
router.patch('/post/:id/comment/:commentId/delete',async(req,res)=>{
    const {id,commentId}=req.params
    try {
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json('Post not found');
        }
        let newcomments=post.comments.filter((comment)=>comment._id != commentId)
        post.comments=newcomments
        const updatedData = await post.save();
        res.status(200).json({ message: 'comment delete success', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting comment', error });
    }
})

// route to edit a comment
router.patch('/post/:id/comment/:commentId/edit',async(req,res)=>{
    const {id,commentId}=req.params
    const {comment}=req.body
    try {
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json('Post not found');
        }
        post.comments.find((comment)=>comment._id == commentId).comment=comment
        const updatedData = await post.save();
        res.status(200).json({ message: 'comment update success', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating comment', error });
    }
})

// route to like a post 
router.patch('/post/:id/like', async (req, res) => {
    const { username, userId } = req.body;
    const id = req.params.id;
    try {
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json('Post not found');
        }

        const likedPostIndex = post.likes.findIndex((like) => like.userId === userId);
        if (likedPostIndex !== -1) {
            // Remove the like if it exists
            post.likes.splice(likedPostIndex, 1);
        } else {
            // Add the like if it doesn't exist
            post.likes.push({ username, userId });
        }

        const updatedData = await post.save();
        res.status(200).json({ message: 'Update success', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating post', error });
    }
});

// route to update post
router.patch('/post/edit/:id',async(req,res)=>{
    const id=req.params.id
    const {title,image}=req.body
    try {
        const updatedpost = await postModel.findByIdAndUpdate(id,{title,image},{new:true});
        if (!updatedpost) {
            return res.status(404).json('Post not found');
        }
       
        res.status(200).json({ message: 'post edit success', data: updatedpost });
    } catch (error) {
        res.status(500).json({ message: 'Server error while editing post', error });
    }
})

// route to delete post
router.delete('/post/delete/:id',async(req,res)=>{
    const id=req.params.id
    try {
        const deletedpost = await postModel.findByIdAndDelete(id);
        if (!deletedpost) {
            return res.status(404).json('Post not found');
        }
       
        res.status(200).json({ message: 'post delete success', data: deletedpost });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deletting post', error });
    }
})

// route to reply a comment
router.patch('/post/:id/comment/:commentId/reply', async(req,res)=>{
    const { username, avatar, reply,userId,commentUser } = req.body;
    const {id,commentId} = req.params
    try {
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json('Post not found');
        }
        post.comments.find((comment)=> comment._id == commentId).replies.unshift({
            username,
            avatar,
            reply,
            userId,
            commentUser
        })
        const updatedData = await post.save();
        res.status(200).json({ message: 'comment reply success', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Server error while replying comment', error });
    }
})

// route to delete a reply
router.patch('/post/:postId/comment/:commentId/reply/:replyId/delete', async(req,res)=>{
    const {postId,commentId,replyId} = req.params
    try {
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json('Post not found');
        }
       const newreplies= post.comments.find((comment)=> comment._id == commentId).replies.filter((reply)=> reply._id != replyId)
       post.comments.find((comment)=> comment._id == commentId).replies=newreplies
        const updatedData = await post.save();
        res.status(200).json({ message: 'reply delete success', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting reply', error });
    }
})

// route to edit a reply
router.patch('/post/:postId/comment/:commentId/reply/:replyId/edit', async(req,res)=>{
    const {postId,commentId,replyId} = req.params
    const {reply}=req.body
    try {
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json('Post not found');
        }
       post.comments.find((comment)=> comment._id == commentId).replies.find((reply)=> reply._id == replyId).reply=reply
        const updatedData = await post.save();
        res.status(200).json({ message: 'reply edit success', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Server error while editing reply', error });
    }
})

module.exports = router;
