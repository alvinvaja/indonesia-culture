import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Wisata } from '../models/wisata.model';

@Injectable({
  providedIn: 'root'
})
export class WisataService {
  private wisatas: Observable<Wisata[]>;
  private wisatasCollection: AngularFirestoreCollection<Wisata>;
  constructor(private db: AngularFirestore) {
    this.wisatasCollection = db.collection<Wisata>('wisata');
    this.wisatas = this.wisatasCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllWisatas() {
    return this.wisatas;
  }

  getDummy() {
    return {
      id: '',
      name: '',
      city: '',
      address: '',
      openHour: '',
      closeHour: '',
      price: 0,
      description: '',
      history: '',
      photo: ''
    };
  }
}
