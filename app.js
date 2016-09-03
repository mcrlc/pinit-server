// npm modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");

// models
const User = require("./models/User");
const Message = require("./models/Message");

// app modules
const userController = require("./controllers/user");
const messageController = require("./controllers/message");
const mainController = require("./controllers/main");
const devController = require("./controllers/dev");
const seedDB = require("./seed");


// app config
dotenv.load({path: '.env'});
const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect to DB
mongoose.connect(process.env.MONGODB_URI/* || process.env.MONGOLAB_URI*/);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});


/**
 * Primary app routes.
 */
app.get("/", mainController.index);

// user routes
app.get("/user/:phone", userController.getUser);
// app.post("/user/register", userController.postRegister);
app.get("/user/:phone/register", userController.getRegister);
app.get("/user/:phone/login", userController.getLogin);

// message routes
app.get("/user/:uid/messages/sent", messageController.getSentMessages);
app.get("/user/:uid/messages/received", messageController.getAllReceivedMessages);
app.get("/user/:uid/messages/received/unread", messageController.getNewReceivedMessages);
//app.post("/user/:uid/messages/new", messageController.postSendMessage);
app.get("/user/:uid/messages/new", messageController.getSendMessage);
app.get("/user/:uid/messages/:mid/unlock", messageController.getUnlockMessage);
//app.post("/user/:uid/messages/unlock", messageController.postUnlockMessage);

// dev routes
app.get("/dev/users", devController.getAllUsers);
app.get("/dev/messages", devController.getAllMessages);

//seedDB();
app.use(errorHandler());

// start Express server.
app.listen(app.get("port"), () => {
  console.log("Express server listening on port %d in %s mode", app.get("port"), app.get("env"));
});

module.exports = app;