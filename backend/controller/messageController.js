const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.sendMessage = asyncHandler (async (req, res) => {
    const {content, chatId} = req.body;
    if(!content || !chatId){
        console.log("invalid data passed into request");
        return res.sendStatus(400);
    }

    // var newMessage = {
    //     sender: req.user._id,
    //     content: content,
    //     chat: chatId,
    // };
    try{
        // var message = await Message.create({
        //     sender: req.user._id,
        //     content: content,
        //     chat: chatId,
        // }).populate("sender", "name pic").populate("chat");
        var message = await Message.create({
            sender: req.user._id,
            content: content,
            chat: chatId,
        });
        var newMessage = await Message.findById(message._id)
        .populate("sender", "name pic")
        .populate("chat");
        
        newMessage = await User.populate(newMessage, {
            path: "chat.users",
            select: "name pic email",
        });
        

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessages: message,
        });

        return res.status(200).json({
            message: newMessage
        });
    }catch(error){
        return res.status(500).json({
            error: error,
        });
    }

});
// allMessage

exports.allMessage = asyncHandler ( async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name pic email")
        .populate("chat");
        return res.status(200).json({
            messages: messages
        });
    }catch(error){
        return res.status(500).json({
            error: error,
        });
    }
});


