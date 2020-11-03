import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: Observable<User[]>;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersCollection = db.collection<User>('users');
    console.log(this.usersCollection);
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllUsers() {
    return this.users;
  }
}
