const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

exports.accessChat = asyncHandler( async (req, res) => {
    const {userId} = req.body;
    if(!userId){
        console.log("userId param not sent with the request.");
        return res.status(400).json({
            error: "no userId sent with the request"
        });
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ]
    }).populate("users").populate("latestMessages");

    isChat = await User.populate(isChat, {
        path: "latestMessages.sender",
        select: "name pic email",
    });

    if(isChat.length > 0){
        return res.status(200).json({
            chat: isChat[0],
        });
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }
        try{
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users");
            return res.status(200).json({
                chat: fullChat,
            });
        }catch(error){
            return res.status(400).json({
                error: "chat doesnt exist."
            });
        }
    }
});

exports.fetchChats = asyncHandler( async (req, res) => {
        try{
            
            const chats = await Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate("users")
            .populate("groupAdmin")
            .sort({updatedAt: -1});
            res.status(200).json({
                chats: chats
            });
            // await Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            // .populate("users")
            // .populate("groupAdmin", "-password")
            // .populate("latestMessage").sort({updatedAt: -1})
            // .then(async (results) => {
            //     results = await User.populate(results, {
            //         path: "latestMessages.sender",
            //         select: "name pic email"
            //     });
            //     res.status(200).json({
            //         chat: results
            //     })
            // }
            //);
            // if(!chat){
            //     return res.status(400).json({
            //         error: "chat doesnt exist."
            //     });
            // }
            // return res.status(200).json({
            //     chat: chat,
            // });
        }catch(error){
            return res.status(400).json({
                error: error
            });
        }

    
});

// create groupChat
exports.createGroupChat = asyncHandler( async (req, res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).json({
            error: "the group chat fields can't be empty"
        });
    }
    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        return res.status(400).json({
            error: "A group must have atleast 2 users"
        });
    }

    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users")
        .populate("groupAdmin");
        res.status(200).json({
            fullGroupChat: fullGroupChat
        });
    }catch(error){
        return res.status(500).json({
            error: `server error: ${error}`
        });
    }

});

// rename group routes
exports.renameGroup = asyncHandler( async (req, res) => {
    const {chatId, chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName: chatName
    }, {
        new: true
    })
    .populate("users")
    .populate("groupAdmin");
    if(!updatedChat){
        return res.status(400).json({
            error: `the chat doesn't exist`
        });
    }
    res.status(200).json({
        updatedChat: updatedChat
    });
});

// add new user to chat group
exports.addToGroup = asyncHandler( async (req, res) => {
    const {chatId, userId} = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: {users: userId}
    }, {
        new: true,
    })
    .populate("users")
    .populate("groupAdmin");
    
    if(!added){
        return res.status(400).json({
            error: `the chat doesn't exist`
        });
    }

    res.status(200).json({
        updatedChat: added
    });
});

// remove from chat group

exports.removeFromGroup = asyncHandler( async (req, res) => {
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: {users: userId}
    }, {
        new: true,
    })
    .populate("users")
    .populate("groupAdmin");
    if(!removed){
        return res.status(400).json({
            error: `the chat doesn't exist`
        });
    }

    res.status(200).json({
        updatedChat: removed
    });
});