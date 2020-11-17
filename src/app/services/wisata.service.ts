import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Wisata } from '../models/wisata.model';

@Injectable({
  providedIn: 'root'
})
export class WisataService {
  private hardcodeCity = [
    'Jakarta', 'Magelang', 'Semarang', 'Jambi', 'Palembang', 'Lampung',
    'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Surabaya', 'Medan',
    'Makassar', 'Padang', 'Pekanbaru', 'Denpasar', 'Manado', 'Malang',
    'Pontianak', 'Kupang', 'Yogyakarta', 'Banjarmasin', 'Cirebon', 'Cilegon',
    'Serang', 'Bengkulu', 'Kediri', 'Pekalongan', 'Tegal', 'Sukabumi', 'Balikpapan',
    'Palu', 'Sabang', 'Merauke', 'Banda Aceh', 'Cimahi', 'Gorontalo', 'Madiun', 'Jayapura'
  ];

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

  getHardCodeCity() {
    return this.hardcodeCity;
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
      photo: '',
      reviewCounter: 0,
      rating: 0
    };
  }

  updateWisataRating(rating: number, wisata: Wisata) {
    this.getAllWisatas().pipe(take(1)).subscribe(res => {
      res.forEach(data => {
        if (data.id === wisata.id) {
          const newSize = data.reviewCounter + 1;
          const newRating = data.rating + rating;
          this.db.collection('wisata').doc(wisata.id).update({
            rating: newRating,
            reviewCounter: newSize
          });
        }
      });
    });
  }

  addWisataReview(review: any) {
    this.updateWisataRating(review.rating, review.wisata);
    this.db.collection('wisata').doc(review.wisata.id).collection('review').add({
      username: review.username,
      rating: review.rating,
      review: review.review
    });
  }
}
