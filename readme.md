User Handlers:
    Registration request:
        Description: First request upon openning the app for the first time.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<phone>/register```
        Responses: UID if successful, 001 if user exists in DB.
        
    Login request:
        Description: Used after getting 001 response from Registration request.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<phone>/login```
        Responses: UID if successful, 002 if user doesn't exist in DB.
        
    Get User Status request:
        Description: To get a user status.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<phone>```
        Response:  
                    ```bash
                    <user>
                        <unseenmessages>boolean</unseenmessages>
                        <newmessages>boolean<newmessages>
                    </user>
                    ```

Message Handlers:                
    Get Sent Messages request:
        Description: Returns all the messages the user has sent.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<id>/messages/sent```
        Response:
        
    Get All Received Messages request:
        Description: Returns all the messages the user has received.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<id>/messages/received```
        Response:
        
    Get Unread Messages request:
        Description: Returns only the unread messages the user has received.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<id>/messages/received/unread```
        Response:
        
    Send New Message request:
        Description: Sends a new message.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<id>/messages/new?phone=<recipient-phone>&latitude=<longtitude>&longtitude=<longtitude>&content=<content>&radius=100```
        Response: 004 if successful.
        
    Unlock Message request:
        Description: Unlocks an unseen message.
        Structure: ```https://pinit-server-mcrlc.c9users.io/user/<id>/messages/<mid>/unlock```
        Response: 005 if successful.