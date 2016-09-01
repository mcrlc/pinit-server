const bodyParser = require("body-parser");
const async = require("async");
const mongoose = require("mongoose");
const jsontoxml = require("jsontoxml");
const User = require("../models/User");
const Message = require("../models/Message");


// messages get sent controller
exports.getSentMessages = (req, res) => {
    User.findById(req.params.uid).populate("sent").exec((err, user) => {
        if(err){
            res.send(err);
        } else {
            res.send(messagesToXML(user.sent));
        }
    });
};

// messages get all received controller
exports.getAllReceivedMessages = (req, res) => {
    User.findById(req.params.uid).populate("received").exec((err, user) => {
        if(err){
            res.send(err);
        } else {
            res.send(messagesToXML(user.received));
        }
    });
};

// messages get new received controller
exports.getNewReceivedMessages = (req, res) => {
    Message.find({
        recipient: req.params.uid,
        isnew: true
    }, (err, messages) => {
        if(err){
            res.send(err);
        } else {
            async.each(messages, (message, callback) => {
                message.isnew = false;
                message.save((err, savedMessage) => {
                    if(err){
                        callback(err);
                    } else {
                        callback();
                    }
                });
            }, (err) => {
                if(err){
                    res.send(err);
                } else {
                    User.findById(req.params.uid, (err, user) => {
                        if(err){
                            res.send(err);
                        } else {
                            user.new_messages = false;
                            user.save((err, savedUser) => {
                                if(err){
                                    res.send(err);
                                } else {
                                    res.send(messagesToXML(messages));
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// messages get send controller
exports.getSendMessage = (req, res) => {
    User.findOne({phone: "+" + req.query.phone}, (err, recipient) => {
        if(err){
            res.send(err);
        } else {
            if(!recipient){
                res.send(`<?xml version="1.0" encoding="utf-8"?>
    <error>003</error>`);
            } else {
                var message = new Message({
                    content: req.query.content,
                    author: req.params.uid,
                    authorphone: req.query.authorphone,
                    recipient: recipient._id,
                    location: {
                        latitude: req.query.latitude,
                        longtitude: req.query.longtitude
                    },
                    radius: req.query.radius,
                    isnew: true,
                    seen: false
                });
                message.save((err, newMessage) => {
                    if(err){
                        res.send(err);
                    } else {
                        recipient.received.push(newMessage._id);
                        recipient.unseen_messages = true;
                        recipient.new_messages = true;
                        recipient.save();
                        User.findById(req.params.uid, (err, user) => {
                            if(err){
                                res.send(err);
                            } else {
                                user.sent.push(newMessage._id);
                                user.save((err, savedMessage) => {
                                    if(err){
                                        res.send(err);
                                    } else {
                                        res.send(`<?xml version="1.0" encoding="utf-8"?>
    <success>004</success>`);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
};

// message post unlock controller
exports.getUnlockMessage = (req, res) => {
    Message.findById(req.params.mid, (err, message) => {
        if(err){
            res.send(err);
        } else {
            message.seen = true;
            message.save((err, savedMessage) => {
                if(err){
                    res.send(err);
                } else {
                    Message.find({
                        recipient: req.params.uid,
                        seen: false
                    }, (err, messages) => {
                        if(!messages || err){
                            User.findById(req.params.uid, (err, user) => {
                                if(err){
                                    res.send(err);
                                } else {
                                    user.unseen_messages = false;
                                    user.save((err, savedUser) => {
                                        if(err){
                                            res.send(err);
                                        } else {
                                            res.send(`<?xml version="1.0" encoding="utf-8"?>
    <success>005</success>`);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

function messageToXML(message){
    var xml =  `<message>
    <content>${message.content}</content>
    <author>${message.author || "Tester"}</author>
    <authorphone>${message.authorphone}</authorphone>
    <recipient>${message.recipient || "Test Subject"}</recipient>
    <latitude>${message.location.latitude}</latitude>
    <longtitude>${message.location.longtitude}</longtitude>
    <radius>${message.radius}</radius>
    <isnew>${message.isnew}</isnew>
    <seen>${message.seen}</seen>
</message>`;
    return xml;
}

function messagesToXML(messages){
    var result =    `<?xml version="1.0" encoding="utf-8"?>
<messages xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://tempuri.org/">`;
    async.eachSeries(messages, (message, callback) => {
        result += `
${messageToXML(message)}`;
        callback();
    }, (err) => {
        if(err){
            console.log(err);
            return err;
        } else {
            result+=`
</messages>`;
        }
    });
    return result;
}