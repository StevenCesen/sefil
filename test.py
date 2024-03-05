# <!DOCTYPE html>
# <head>
#   <title>Pusher Test</title>
#   <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
#   <script>

#     // Enable pusher logging - don't include this in production
#     Pusher.logToConsole = true;

#     var pusher = new Pusher('72f41397173889c67e4e', {
#       cluster: 'us2'
#     });

#     var channel = pusher.subscribe('notification');
#     channel.bind('notification', function(data) {
#       alert(JSON.stringify(data));
#     });
#   </script>
# </head>
# <body>
#   <h1>Pusher Test</h1>
#   <p>
#     Try publishing an event to channel <code>my-channel</code>
#     with event name <code>my-event</code>.
#   </p>
# </body>
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("./test.json")
firebase_admin.initialize_app(cred)

db=firestore.client()

data={
    
}

collection=db.collection('user').document()
# collection.set({
#     'email':'juan@gmail.com',
#     'name':'Juan',
#     'lastname':'Ochoa',
#     'passwrod':'123456789',
#     'rol':'client'
# })

# print(collection.id)


print(collection.get())

