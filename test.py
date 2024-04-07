
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

return [
            'A7' => ['font' => ['italic' => true]],
            'B7'  => ['font' => ['size' => 16]],
            'C7'  => ['font' => ['size' => 16]],
            'D7'  => ['font' => ['size' => 16]],
            'E7'  => ['font' => ['size' => 16]],
            'F7'  => ['font' => ['size' => 16]],
            'G7'  => ['font' => ['size' => 16]],
            'H7'  => ['font' => ['size' => 16]],
            'I7'  => ['font' => ['size' => 16]],
            'J7'  => ['font' => ['size' => 16]],
            'K7'  => ['font' => ['size' => 16]],
            'L7'  => ['font' => ['size' => 16]],
            'M7'  => ['font' => ['size' => 16]],
            'N7'  => ['font' => ['size' => 16]],
            'O7'  => ['font' => ['size' => 16]],
            'P7'  => ['font' => ['size' => 16]],
            'Q7'  => ['font' => ['size' => 16]],
            'R7'  => ['font' => ['size' => 16]],
            'S7'  => ['font' => ['size' => 16]],
            'T7'  => ['font' => ['size' => 16]],
        ];

