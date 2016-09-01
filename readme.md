<h1>Pinit Server API Usage</h1>
<h2>User Handlers:</h2>
<h3>Registration request:</h3>
<h4>Description:</h4>
First request upon openning the app for the first time.
<h4>Structure:</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<phone>/register
</code>
<h4>Responses:</h4>
UID if successful, 001 if user exists in DB.
<hr>
<h3>Login request:</h3>
<h4>Description:</h4>
Used after getting 001 response from Registration request.
<h4>Structure:</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<phone>/login
</code>
<h4>Responses:</h4>
UID if successful, 002 if user doesn't exist in DB.
<hr>
<h3>Get User Status request:</h3>
<h4>Description:</h4>
Used to get a user status.
<h4>Structure:</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<phone>
</code>
<h4>Response:</h4>
<code>
<user>
    <unseenmessages>boolean</unseenmessages>
    <newmessages>boolean<newmessages>
</user>
</code>
<hr>
<h2>Message Handlers:</h2>
<h3>Get Sent Messages request:</h3>
<h4>Description:</h4>
Returns all the messages the user has sent.
<h4>Structure</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/sent
</code>
<h4>Response:</h4>
<hr>
<h3>Get All Received Messages request:</h3>
<h4>Description:</h4>
Returns all the messages the user has received.
<h4>Structure:</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/received
</code>
<h4>Response:</h4>
<hr>
<h3>Get Unread Messages request:</h3>
<h4>Description:</h4>
Returns only the unread messages the user has received.
<h4>Structure:</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/received/unread
</code>
<h4>Response:</h4>
<hr>
<h3>Send New Message request:</h3>
<h4>Description:</h4>
Sends a new message.
<h4>Structure:</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/new?phone=<recipient-phone>&latitude=<longtitude>&longtitude=<longtitude>&content=<content>&radius=100
</code>
<h4>Response:</h4>
004 if successful.
<hr>
<h3>Unlock Message request:</h3>
<h4>Description: </h4>
Unlocks an unseen message.
<h4>Structure:</h4>
<code>
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/<mid>/unlock
</code>
<h4>Response:</h4>
005 if successful.