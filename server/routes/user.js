const express = require('express');
const router = express.Router();
const userModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// route to get all users
router.get('/users',async(req,res)=>{
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error while getting users', error });
    }
})

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            username,
            email,
            password: hashPassword
        });
        const savedUser = await user.save();
        res.status(200).json({ message: 'Signup successful', data: savedUser});
    } catch (error) {
        res.status(500).json({ message: 'Error while signing up', error });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this email please create an account' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }
        const token = jwt.sign({ ID: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful',data:{userId:user._id}});
    } catch (error) {
        res.status(500).json({ message: 'internal server error', error });
    }
});

// Update profile route
router.patch('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { avatar } = req.body;
    try {
        const user = await userModel.findByIdAndUpdate(id, { avatar }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error while updating profile picture', error });
    }
});

// Get user profile route
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error while getting profile', error: err });
    }
});

// Route to unfollow user
router.patch('/unfollow/:id', async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        const userToUnfollow = await userModel.findById(userId);
        if (!user || !userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.following = user.following.filter(person => person.userId != userId);
        userToUnfollow.followers = userToUnfollow.followers.filter(person => person.userId != id);

        const savedUser = await user.save();
        const savedFollower = await userToUnfollow.save();
        res.status(200).json({ message: 'Unfollowing success', myUser: savedUser, unfollowedUser: savedFollower });
    } catch (err) {
        return res.status(500).json({ message: 'Error while unfollowing', error: err });
    }
});

// Route to follow user
router.patch('/follow/:id', async (req, res) => {
    const { username, userId, avatar,followers,following } = req.body;
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        const userToFollow = await userModel.findById(userId);
        if (!user || !userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.following.push({ username, userId, avatar,following,followers });
        userToFollow.followers.push({
            username: user.username,
            userId: user._id,
            avatar: user.avatar,
            following: user.following,
            followers: user.followers
        });

        const savedUser = await user.save();
        const savedFollower = await userToFollow.save();
        res.status(200).json({ message: 'Following success', myUser: savedUser, followedUser: savedFollower });
    } catch (err) {
        return res.status(500).json({ message: 'Error while following', error: err });
    }
});

// Route to remove follower
router.patch('/follower/remove/:id', async (req, res) => {
    const { userId } = req.body;  // This is the user who wants to remove a follower
    const { id } = req.params;    // This is the follower being removed
    try {
        const myUser = await userModel.findById(userId);
        const follower = await userModel.findById(id);
        
        if (!myUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!follower) {
            return res.status(404).json({ message: 'Follower not found' });
        }

        myUser.followers = myUser.followers.filter(person => person.userId.toString() !== id);
        follower.following = follower.following.filter(person => person.userId.toString() !== userId);

        await myUser.save();
        await follower.save();

        res.status(200).json({ message: 'Follower removed successfully', myUser, follower });
    } catch (err) {
        res.status(500).json({ message: 'Error while removing follower', error: err.message });
    }
});


module.exports = router;
