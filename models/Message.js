const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    authorphone: String,
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    location: {
        latitude: String,
        longtitude: String
    },
    radius: Number,
    isnew: Boolean,
    seen: Boolean,
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;