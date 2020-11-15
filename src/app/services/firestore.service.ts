import { User } from 'src/app/models/users.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: AngularFirestore) {}

  tryRegister(
    email: string,
    name: string,
    age: number,
    contribution:number
    // songName: string
    ){
      const id = this.firestore.createId();
    
      return this.firestore.collection('users').add({
        email,
        name,
        age,
        contribution
      });
  }
}
