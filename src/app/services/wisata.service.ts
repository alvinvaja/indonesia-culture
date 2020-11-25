import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Wisata } from "../models/wisata.model";
import { WisataReview } from "../models/wisataReview.model";
import { UsersService } from "./users.service";

@Injectable({
  providedIn: "root",
})
export class WisataService {
  private hardcodeCity = [
    "Jakarta",
    "Magelang",
    "Semarang",
    "Jambi",
    "Palembang",
    "Lampung",
    "Bogor",
    "Depok",
    "Tangerang",
    "Bekasi",
    "Bandung",
    "Surabaya",
    "Medan",
    "Makassar",
    "Padang",
    "Pekanbaru",
    "Denpasar",
    "Manado",
    "Malang",
    "Pontianak",
    "Kupang",
    "Yogyakarta",
    "Banjarmasin",
    "Cirebon",
    "Cilegon",
    "Serang",
    "Bengkulu",
    "Kediri",
    "Pekalongan",
    "Tegal",
    "Sukabumi",
    "Balikpapan",
    "Palu",
    "Sabang",
    "Merauke",
    "Banda Aceh",
    "Cimahi",
    "Gorontalo",
    "Madiun",
    "Jayapura",
  ];

  private wisatas: Observable<Wisata[]>;
  private wisatasCollection: AngularFirestoreCollection<Wisata>;
  constructor(private db: AngularFirestore, private userService: UsersService) {
    this.wisatasCollection = db.collection<Wisata>("wisata");
    this.wisatas = this.wisatasCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
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

  getWisataReviews(key: string) {
    return this.db
      .collection<WisataReview>("wisata/" + key + "/review")
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getHardCodeCity() {
    return this.hardcodeCity;
  }

  getDummy() {
    return {
      id: "",
      name: "",
      city: "",
      address: "",
      openHour: "",
      closeHour: "",
      price: 0,
      description: "",
      history: "",
      photo: "",
      reviewCounter: 0,
      rating: 0,
      longtitude: 0,
      latitude: 0,
    };
  }

  updateWisataRating(rating: number, wisata: Wisata) {
    this.getAllWisatas()
      .pipe(take(1))
      .subscribe((res) => {
        res.forEach((data) => {
          if (data.id === wisata.id) {
            const newSize = data.reviewCounter + 1;
            const newRating = data.rating + rating;
            this.db.collection("wisata").doc(wisata.id).update({
              rating: newRating,
              reviewCounter: newSize,
            });
          }
        });
      });
  }

  addWisataReview(review: any) {
    this.updateWisataRating(review.rating, review.wisata);

    this.userService
      .getSingleUser(review.email)
      .pipe(take(1))
      .subscribe((res) => {
        const data = res[0];
        this.db
          .collection("wisata")
          .doc(review.wisata.id)
          .collection("review")
          .add({
            username: data.name,
            userphoto: data.photo,
            rating: review.rating,
            review: review.review,
          });
      });
  }

  delete(wisataId: string): Promise<void> {
    return this.db.doc("wisata/" + wisataId).delete();
  }
}
