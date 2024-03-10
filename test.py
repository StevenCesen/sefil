
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("./test.json")
firebase_admin.initialize_app(cred)

db=firestore.client()


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

