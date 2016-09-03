const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: String,
  phone: { type: String, unique: true },
  registered: Boolean,
  
  profile: {
    full_name: { type: String, default: "" },
    gender: { type: String, default: "" },
    birthday: { type: Number, default: "" },
    picture: { type: String, default: "" }
  },
  
  unseen_messages: Boolean,
  new_messages: Boolean,
  sent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }],
  received: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
  }]
}, { timestamps: true });

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model("User", userSchema);

module.exports = User;