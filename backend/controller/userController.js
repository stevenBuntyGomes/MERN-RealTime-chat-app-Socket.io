const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const cloudinary = require('cloudinary');

exports.registerUser = asyncHandler(async (req, res) => {
    
    const {name, email, password, confirmPassword, pic} = req.body;
    
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                error: "input fields can not be empty"
            });
        }
        if(password !== confirmPassword){
           return res.status(400).json({
                error: "Confirm Password Must Match with the Password field."
            });
        }

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                error: "user already exists."
            });
        }

        const myCloud = await cloudinary.v2.uploader.upload(pic, {
            folder: "chat_app"
        });

        const user = await User.create({
            name: name,
            email: email,
            password: password,
            pic: {
                public_id: myCloud.public_id,
                url: myCloud.url,
            },
        });

        if(!user){
            return res.status(400).json({
                error: "this is latest error register."
            });
        }

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true,            
        };

        
        const userSend = await User.findById(user._id);


        res.status(201).cookie("token", token, options).json({
            user: userSend,  
            token: token,
        });

        

        
});

exports.authUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({
                    error: "user doesnt exist."
                });
        }

        if(user && await user.matchPassword(password)) {
            const authUser = await User.findById(user._id);
            return res.status(200).json({
                success: "reached here",
                user: authUser,
            })
            
            const token = await user.generateToken();

            const options = {
            expires: new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true,            
        };
            const userSend = await User.findById(user._id);
            res.status(200).cookie("token", token, options).json({
                user: userSend,
                token: token,
            });
        }else{
            return res.status(400).json({
                error: "invalid email or password."
            });
        }
    }catch(error){
        return res.status(500).json({
                    error: "this is latest error register",
                });
    }
};


exports.myProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(400).json({
            error: "user doesnt exist."
        });
    }

    res.status(200).json({
        user,
    });
});

// /api/users?search=setven
exports.allUsers = asyncHandler( async (req ,res) => {
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    } : {};

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    res.status(200).json({
        users: users,
        success: true,
    });
});

// exports logout user
exports.logoutUser = asyncHandler ( async (req, res) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()), 
        httpOnly: true,
    }).json({
        success: true,
        message: "logged out successfully"
    });
});