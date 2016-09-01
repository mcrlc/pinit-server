const async = require('async');
const mongoose    = require("mongoose"),
    User  = require("./models/User"),
    Message     = require("./models/Message");

    
const num_of_users = 3;
const numbers = [
        "555-478-7672",
        "555-522-8243",
        "555-610-6679"
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
    }
    ];
const num_of_messages = 3;

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
            unseen_messages: false,
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
    User.findOne({phone: "555-478-7672"}, (err, sender) => {
        User.findOne({phone: "555-522-8243"}, (err, recipient) => {
            async.timesSeries(num_of_messages, (i, next) => {
                new Message({
                    content: `Message ${i}`,
                    author: sender.id,
                    authorphone: sender.phone,
                    recipient: recipient._id,
                    location: locations[i],
                    radius: 100,
                    isnew: true,
                    seen: false
                }).save((err, newMessage) => {
                    if(err){
                        console.log(err);
                        next(err, null);
                    } else {
                        console.log(`message ${i} created!`);
                        sender.sent.push(newMessage._id);
                        recipient.received.push(newMessage._id);
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


/*
// seed lists
const seedMessages = (next) => {
    User.find({}, (err, users) =>{
        if(err){
            console.log(err);
        } else {
            async.eachOfSeries(users, (user, i, callback) => {
                async.timesSeries(num_of_lists, (i, next) => {
                    new List({
                        title: `list ${i} of user ${user.email}`,
                        owner: user._id
                    }).save((err, newList) => {
                        if(err){
                            console.log(err);
                            next(err, null);
                        } else {
                            user.lists.push(newList._id);
                            user.save((err, user) => {
                                if(err){
                                    console.log(err);
                                    next(err, null);
                                } else {
                                    console.log(`added ${newList.title}`);
                                    next(null, user);
                                }
                            });
                        }
                    });
                }, (err, lists) => {
                    if(err){
                        console.log(err);
                        callback(err);
                    } else {
                        console.log(`added ${num_of_lists} lists to user ${user.email}`);
                        callback();
                    }
                });
            }, (err) => {
                if(err){
                    console.log(err);
                    next(err);
                } else {
                    console.log('finished adding lists!');
                    next();
                }
            });
        }
    });
};

// seed tasks
const seedTasks = (next) => {
    List.find({}, (err, lists) =>{
        if(err){
            console.log(err);
        } else {
            async.eachOfSeries(lists, (list, i, callback) => {
                async.timesSeries(num_of_tasks, (i, next) => {
                    new Task({
                        content: `task ${i} of ${list.title}`,
                        author: list.owner,
                        parent_list: list._id,
                        done: false
                    }).save((err, newTask) => {
                        if(err){
                            console.log(err);
                            next(err, null);
                        } else {
                            list.tasks.push(newTask._id);
                            list.save((err, list) => {
                                if(err){
                                    console.log(err);
                                    next(err, null);
                                } else {
                                    console.log(`added ${newTask.content}`);
                                    next(null, list);
                                }
                            });
                        }
                    });
                }, (err, tasks) => {
                    if(err){
                        console.log(err);
                        callback(err);
                    } else {
                        console.log(`added ${num_of_tasks} tasks to ${list.title}`);
                        callback();
                    }
                });
            }, (err) => {
                if(err){
                    console.log(err);
                    next(err);
                } else {
                    console.log('finished adding tasks!');
                    next();
                }
            });
        }
    });
};
*/

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
}
module.exports = seedDB;