const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const async = require("async");
const User = require("../models/User");
const Message = require("../models/Message");


exports.getAllUsers = (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.send(err);
        } else {
            console.log(usersToXML(users));
            res.send(usersToXML(users));
        }
    });
};

exports.getAllMessages = (req, res) => {
    Message.find({}, (err, messages) => {
        if(err){
            res.send(err);
        } else {
            console.log(messagesToXML(messages));
            res.send(messagesToXML(messages));
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


function userToXML(user){
    var xml =  `<user>
    <phone>${user.phone}</phone>
    <unseenmessages>${user.unseen_messages}</unseenmessages>
    <newmessages>${user.new_messages}</newmessages>
</user>`;
    return xml;
}

function usersToXML(users){
    var result =    `<?xml version="1.0" encoding="utf-8"?>
<users xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://tempuri.org/">`;
    async.eachSeries(users, (user, callback) => {
        result += `
${userToXML(user)}`;
        callback();
    }, (err) => {
        if(err){
            console.log(err);
            return err;
        } else {
            result+=`
</users>`;
        }
    });
    return result;
}