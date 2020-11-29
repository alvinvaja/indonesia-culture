import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UploadPhoto } from 'src/app/models/uploadPhoto.model';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase/app';
import { UsersService } from 'src/app/services/users.service';
import { WisataPhoto } from 'src/app/models/wisataPhoto.model';
import { User } from 'src/app/models/users.model';

@Component({
  selector: 'app-photo-approve',
  templateUrl: './photo-approve.page.html',
  styleUrls: ['./photo-approve.page.scss'],
})
export class PhotoApprovePage implements OnInit {
  approves: UploadPhoto[];

  constructor(
    private db: AngularFirestore,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.approves = [];
    this.getAllPendingPhotos().subscribe(res => {
      this.approves = res;
    });
  }

  getAllPendingPhotos() {
    return this.db.collection<UploadPhoto>('uploads').snapshotChanges().pipe(
      map(actions => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  approve(item: UploadPhoto) {
    this.db.collection<WisataPhoto>('wisata/' + item.wisataId + '/photos').add({
      photo: item.photo
    });
    this.userService.getSingleUser(localStorage.getItem('email')).pipe(take(1)).subscribe(res => {
      const data = res[0];
      this.db.collection('users').doc(data.id).collection('photos').add({
        photo: item.photo
      });
      this.db.collection<User>('users').doc(data.id).update({
        contribution: data.contribution + 5
      });
    });
    this.removePendingPhoto(item.id);
  }

  reject(item: UploadPhoto) {
    firebase.storage().ref('uploadWisata/' + item.photoName).delete();
    this.removePendingPhoto(item.id);
  }

  removePendingPhoto(id: string) {
    this.db.collection('uploads').doc(id).delete();
  }
}
