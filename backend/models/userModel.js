const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    pic: {
        public_id: String,
        url: String,
    }
}, {
    timestamps: true,
});

// pre("save") means before saving
userModel.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userModel.methods.generateToken = function () {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET);
}


userModel.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}


module.exports = mongoose.model("User", userModel);