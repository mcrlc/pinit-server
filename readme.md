<h2>User Handlers:</h2>
<h3>Registration request:</h3>
<h4>Description:</h4>
First request upon openning the app for the first time.
<h4>Structure:</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<phone>/register
```
<h4>Responses:</h4>
UID if successful, 001 if user exists in DB.
        
<h3>Login request:</h3>
<h4>Description:</h4>
Used after getting 001 response from Registration request.
<h4>Structure:</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<phone>/login
```
<h4>Responses:</h4>
UID if successful, 002 if user doesn't exist in DB.
    
<h3>Get User Status request:</h3>
<h4>Description:</h4>
Used to get a user status.
<h4>Structure:</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<phone>
```
<h4>Response:</h4>
```bash
<user>
    <unseenmessages>boolean</unseenmessages>
    <newmessages>boolean<newmessages>
</user>
```

<h2>Message Handlers:</h2>
<h3>Get Sent Messages request:</h3>
<h4>Description:</h4>
Returns all the messages the user has sent.
<h4>Structure</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/sent
```
<h4>Response:</h4>
        
<h3>Get All Received Messages request:</h3>
<h4>Description:</h4>
Returns all the messages the user has received.
<h4>Structure:</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/received
```
<h4>Response:</h4>

<h3>Get Unread Messages request:</h3>
<h4>Description:</h4>
Returns only the unread messages the user has received.
<h4>Structure:</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/received/unread
```
<h4>Response:</h4>
    
<h3>Send New Message request:</h3>
<h4>Description:</h4>
Sends a new message.
<h4>Structure:</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/new?phone=<recipient-phone>&latitude=<longtitude>&longtitude=<longtitude>&content=<content>&radius=100
```
<h4>Response:</h4>
004 if successful.
    
<h3>Unlock Message request:</h3>
<h4>Description: </h4>
Unlocks an unseen message.
<h4>Structure:</h4>
```
https://pinit-server-mcrlc.c9users.io/user/<id>/messages/<mid>/unlock
```
<h4>Response:</h4>
005 if successful.