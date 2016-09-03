const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const async = require("async");
const reqest = require("request");
const User = require("../models/User");

// user get resgistration route controller
exports.getRegister = (req, res) => {
    var user = new User({
        email: req.query.email,
        phone: req.params.phone,
        registered: true,
        profile: {
            full_name: req.query.full_name,
            gender: req.query.gender,
            birthday: req.query.birthday,
            // picture?
        },
        unread_messages: false,
        sent: [],
        received: []
    });
    
    User.findOne({phone: req.params.phone}, (err, existingUser) => {
        if(err){
            console.log(err);
        }
        if(existingUser){
            console.error("Duplicate signup for phone: " + req.params.phone);
            res.send(`<?xml version="1.0" encoding="utf-8"?>
    <error>001</error>`);
        } else {
            user.save((err, user) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(`<?xml version="1.0" encoding="utf-8"?>
    <uid>${user._id}</uid>`);
                }
            });
        }
    });
};

//user login route
exports.getLogin = (req, res) => {
    User.findOne({phone: req.params.phone}, (err, user) => {
        if(err || !user){
            res.send(`<?xml version="1.0" encoding="utf-8"?>
    <error>002</error>`);
        } else {
            res.send(`<?xml version="1.0" encoding="utf-8"?>
    <uid>${user._id}</uid>`);
        }
    });
}


/*
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
*/

// user show route controller
exports.getUser = (req, res) => {
    User.findOne({phone: req.params.phone}, (err, user) =>{
        if(err){
            res.send(err);
        } else {
            res.send(`<?xml version="1.0" encoding="utf-8"?>
    ${userToXML(user)}`);
        }
    });
};


function userToXML(user){
    var xml =  `<user>
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