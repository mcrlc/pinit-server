const async = require('async');
const mongoose    = require("mongoose"),
    User  = require("./models/User"),
    Message     = require("./models/Message");

    
const num_of_users = 3;
const numbers = [
        "5554787672",
        "5555228243",
        "5556106679"
    ];
const locations = [
    {
        latitude: "32.063063",
        longtitude: "34.779064"
    },
    {
        latitude: "32.062727",
        longtitude: "34.777396"
    },
    {
        latitude: "32.064332",
        longtitude: "34.775599"
    },
    {
        latitude: "32.065298",
        longtitude: "34.782877"
    }
    ];
const num_of_messages = 4;

// clear DB
const clearDB = (next) => {
    User.remove({}, (err) => {
        if(err){
            console.log('could not clear users');
            console.log(err);
        } else {
            Message.remove({}, (err) => {
                if(err){
                    console.log('could not clear messages');
                    console.log(err);
                } else {
                    console.log('DB cleared!');
                    next();
                }
            });
        }
    });
};

// seed users
const seedUsers = (next) => {
    async.timesSeries(num_of_users, (i, next) => {
        new User({
            email: `test${i}@gmail.com`,
            phone: `${numbers[i]}`,
            profile: {
                full_name: `John Smith ${i}`,
                gender: "Male",
                birthday: 19901101 + i
            },
            unseen_messages: (i==1)?true:false,
            new_messages: false
        }).save((err, newUser) => {
            if(err){
                console.log(err);
                next(err, null);
            } else {
                console.log(`user ${i} created!`);
                next(null, newUser);
            }
        });
    }, (err, users) => {
        if(err){
            console.log(err);
            next(err);
        } else {
            console.log(`created ${num_of_users} users!`);
            next();
        }
    });
};

const seedMessages = (next) => {
    User.findOne({phone: "5554787672"}, (err, sender) => {
        User.findOne({phone: "5555228243"}, (err, recipient) => {
            async.timesSeries(num_of_messages, (i, next) => {
                new Message({
                    content: `Message ${i}`,
                    author: (i==3)?recipient._id:sender._id,
                    authorphone: (i==3)?recipient.phone:sender.phone,
                    recipient: (i==3)?sender._id:recipient._id,
                    location: locations[i],
                    radius: 100,
                    isnew: true,
                    seen: (i==1)?false:true
                }).save((err, newMessage) => {
                    if(err){
                        console.log(err);
                        next(err, null);
                    } else {
                        console.log(`message ${i} created!`);
                        if(i==3){
                            sender.received.push(newMessage._id);
                            recipient.sent.push(newMessage._id);
                        } else {
                            sender.sent.push(newMessage._id);
                            recipient.received.push(newMessage._id);
                        }
                        next(null, newMessage);
                    }
                });
            }, (err, messages) => {
                if(err){
                    console.log(err);
                    next(err);
                } else {
                    sender.save((err, savedSender) => {
                        if(err){
                            console.log(err);
                        } else {
                            recipient.save((err, savedRecipient) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    console.log(`created ${num_of_messages} messages!`);
                                    next();
                                }
                            });
                        }
                    });
                }
            });
        });
    });
};

const seedDB = () => {
    async.series([
        clearDB,
        seedUsers,
        seedMessages
    ], (err, result) => {
        if(err){
            console.log(err);
        } else {
            console.log('DB seeded!');
        }
    });
};
module.exports = seedDB;