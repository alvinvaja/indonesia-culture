import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private singleUser: User;
  private users: Observable<User[]>;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersCollection = db.collection<User>('users');
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

  getSingleUser(email: string) {
    return this.db.collection<User>('users', ref => ref.where('email', '==', email).limit(1)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUserReviews() {
    const email = localStorage.getItem('email');
    const user = this.getSingleUser(email);

    return user;
  }

  registerToFireStore(email: string, name: string, age: number, contribution: number) {
    this.db.collection('users').add({
      email,
      name,
      age,
      contribution,
      photo: '../../../../assets/icon/avatar.svg'
    });
  }

  addUserReview(review: any) {
    const email = localStorage.getItem('email');

    const currentUser = this.getSingleUser(email);
    currentUser.pipe(take(1)).subscribe(res => {
      const data = res[0];
      this.db.collection('users').doc(data.id).update({
        reviewCounter: data.reviewCounter + 1,
        contribution: data.contribution + 1
      });
      this.db.collection('users').doc(data.id).collection('review').add({
        rating: review.rating,
        review: review.review,
        wisataName: review.wisataName,
        wisataPhoto: review.wisataPhoto
      });
    });
  }

  updatePhoto(newPhoto: string) {
    const email = localStorage.getItem('email');

    const currentUser = this.getSingleUser(email);
    currentUser.pipe(take(1)).subscribe(res => {
      const data = res[0];
      this.db.collection('users').doc(data.id).update({
        photo: newPhoto
      });
    });
  }
}
