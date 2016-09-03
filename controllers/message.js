const bodyParser = require("body-parser");
const async = require("async");
const mongoose = require("mongoose");
const User = require("../models/User");
const Message = require("../models/Message");
const google = require("googleapis");
const shortURL = google.urlshortener({version: 'v1', auth: 'API KEY'});
const dotenv = require("dotenv");
dotenv.load({path: __dirname + '/../.env'});
const clockwork = require("clockwork")({key: process.env.CLOCKWORK_API_KEY});

const messageToXML = (message) => {
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
};

const messagesToXML = (messages) => {
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
};

const sendSMS = (query) => {
    shortURL.url.insert({
        resource: { longUrl: `http://www.google.com/maps/place/${query.latitude},${query.longtitude}` },
        key: process.env.GOOGLE_API_KEY
    }, (err, res) => {
        if(err){
            console.log(err);
        } else {
            var msg = `Hi!
Someone has left you a message in ${res.id}.
Get Pinit! and view your message!`;
            clockwork.sendSms({ To: `972${query.phone}`, Content: msg}, function(error, resp) {
                if (error) {
                	console.log('Something went wrong', error);
                } else {
                    console.log('Message sent to',resp.responses[0].to);
                    console.log('MessageID was',resp.responses[0].id);
                }
            });
        }
    });
};

const sendMSG = (req, res, recipient, next) => {
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
            console.log("Error saving message!");
            console.log(err);
            next(err);
        } else {
            recipient.received.push(newMessage._id);
            recipient.unseen_messages = true;
            recipient.new_messages = true;
            recipient.save((err, savedRecipient) => {
                if(err){
                    console.log("Error saving recipient!");
                    console.log(err);
                    next(err);
                }
                User.findById(req.params.uid, (err, sender) => {
                    if(err || !sender){
                        console.log("Error finding sender!");
                        console.log(err);
                        next(err);
                    } else {
                        sender.sent.push(newMessage._id);
                        sender.save((err, savedSender) => {
                            if(err){
                                console.log("Error saving sender!");
                                console.log(err);
                                next(err);
                            } else {
                                next(`<?xml version="1.0" encoding="utf-8"?>
<success>004</success>`);
                            }
                        });
                    }
                });
            });
        }
    });
};


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
    User.findOne({phone: req.query.phone}, (err, recipient) => {
        if(err){
            console.log("Error finding recipient!");
            console.log(err);
            res.send(err);
        } else {
            if(!recipient){
                new User({
                    phone: req.query.phone,
                    registered: false
                }).save((err, recipient) => {
                    if(err){
                        console.log("Error saving new recipient!");
                        console.log(err);
                        res.send(err);
                    } else {
                        sendMSG(req, res, recipient, (result) => {
                            if(typeof(result) === "string" && result.substr(0,5) === "<?xml"){
                                sendSMS(req.query);
                            }
                            res.send(result);
                        });
                    }
                });
            } else if(!recipient.registered){
                sendMSG(req, res, recipient, (result) => {
                    if(typeof(result) === "string" && result.substr(0,5) === "<?xml"){
                        sendSMS(req.query);
                    }
                    res.send(result);
                });
            } else {
                sendMSG(req, res, recipient, res.send);
            }
        }
    });
};

// message post unlock controller
exports.getUnlockMessage = (req, res) => {
    Message.findById(req.params.mid, (err, message) => {
        if(err || !message){
            console.log("Error finding message!");
            res.send(req.params);
        } else {
            message.seen = true;
            message.save((err, savedMessage) => {
                if(err){
                    console.log("Error saving message!");
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
                        } else {
                            res.send(`<?xml version="1.0" encoding="utf-8"?>
    <success>005</success>`);
                        }
                    });
                }
            });
        }
    });
};