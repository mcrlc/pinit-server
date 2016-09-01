const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const reqest = require("request");
const User = require("../models/User");


// user resgistration route controller
exports.postRegister = (req, res) => {
    var user = new User({
        email: req.body.email,
        phone: req.body.phone,
        profile: {
            full_name: req.body.profile.full_name,
            gender: req.body.profile.gender,
            birthday: req.body.profile.birthday,
            // picture?
        },
        unread_messages: false,
        sent: [],
        received: []
    });
    
    User.findOne({phone: req.body.phone}, (err, existingUser) => {
        if(existingUser){
            console.error("Duplicate signup for phone: " + req.body.phone);
            res.send(`Phone number ${req.body.phone} already exists, please log in`);
        }
        user.save((err, user) => {
            if(err){
                res.send(err);
            } else {
                res.send(user._id);
            }
        });
    });
};


//user login route
exports.postLogin = (req, res) => {
    User.findOne({phone: req.body.phone}, (err, user) => {
        if(err){
            res.send(err);
        } else {
            res.send(user._id);
        }
    });
}


// user show route controller
exports.getUser = (req, res) => {
    User.findOne({phone: req.params.phone}, (err, user) =>{
        if(err){
            res.send(err);
        } else {
            res.send(user);
        }
    });
};


function messageToXML(message){
    var xml =  `<message>
                    <content>${message.content}</content>
                    <author>${message.author || "Tester"}</author>
                    <authorphone>${message.authorphone}</authorphone>
                    <recipient>${message.recipient || "Test Subject"}</recipient>
                    <location>${message.location}</location>
                    <radius>${message.radius}</radius>
                    <isnew>${message.isnew}</isnew>
                    <seen>${message.seen}</seen>
                </message>`;
    return xml;
}

function arrayToXML(messages){
    var result =    `<?xml version="1.0" encoding="utf-8"?>
                        <messages xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://tempuri.org/">`;
    async.eachSeries(messages, (message, callback) => {
        result += messageToXML(message);
        callback();
    }, (err) => {
        if(err){
            console.log(err);
            return err;
        } else {
            result+="</messages>"
        }
    });
    return result;
}