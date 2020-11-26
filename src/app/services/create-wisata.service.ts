import { Wisata } from "./../models/wisata.model";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CreateWisataService {
  // private users: Observable<User[]>;
  private wisataCollection: AngularFirestoreCollection<Wisata>;
  private wisata: Observable<Wisata[]>;
  constructor(private db: AngularFirestore) {
    this.wisataCollection = db.collection<Wisata>("wisata");
    this.wisata = this.wisataCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  registerToFireStore(
    address: string,
    city: string,
    closeHour: number,
    description: string,
    history: string,
    name: string,
    openHour: string,
    photo: string,
    price: number,
    rating: number,
    reviewCounter: number,
    latitude: number,
    longtitude: number
  ) {
    this.db.collection("wisata").add({
      address,
      city,
      closeHour,
      description,
      history,
      name,
      openHour,
      photo,
      price,
      rating,
      reviewCounter,
      latitude,
      longtitude,
    });
  }
}
