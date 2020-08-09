const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var userSchema = new Schema({
username: {
    type: String,
    required: true,
},

password: {
    type: String,
    required: true,
},

email: {
    type: String,
    required: true,
    unique: true
},
tokens: [{
    token:  {
    type: String,
    require: true
}

}],

}, {
timestamps: true
});


userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "www.w.w.w.w.w.", { expiresIn: '2d' })

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// user Login
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Email do not exist')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid login credentials')
    }
    return user
}

// hash password when user signsup and then save to database
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Compile model from schema
const User = mongoose.model('user', userSchema);
module.exports = User;