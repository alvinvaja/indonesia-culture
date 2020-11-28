import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserReview } from 'src/app/models/userReview.model';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import { map, take } from 'rxjs/operators';
import { Camera } from '@ionic-native/camera/ngx';
import { LoadingController } from '@ionic/angular';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataPhoto } from 'src/app/models/wisataPhoto.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;
  userReview: UserReview[] = [];
  userPhotos: WisataPhoto[] = [];
  interval: any;
  showReview: boolean;

  constructor(
    private userService: UsersService,
    private router: Router,
    private db: AngularFirestore,
    private camera: Camera,
    private loadCtrl: LoadingController,
    private storageService: StorageService
  ) {
    this.user = { id: '', name: '-', age: 0, contribution: 0, email: '-', reviewCounter: 0, photo: '' };
    this.userPhotos = [
      { photo: 'https://dummyimage.com/600x400/000/fff' },
      { photo: 'https://dummyimage.com/600x400/000/fff' },
      { photo: 'https://dummyimage.com/600x400/000/fff' }
    ];
    this.showReview = true;
    this.interval = setInterval(() => {
      const currentSession = localStorage.getItem('email') !== null ? localStorage.getItem('email') : '-';
      if (this.user.email !== currentSession) {
        if (currentSession === '-') {
          this.user = { id: '', name: '-', age: 0, contribution: 0, email: '-', reviewCounter: 0, photo: '' };
          this.userReview = [];
        } else {
          this.userService.getSingleUser(currentSession).subscribe(res => {
            this.user = res[0];
          });

          this.userService.getSingleUser(currentSession).pipe(take(1)).subscribe(res => {
            const data = res[0];
            this.db.collection<UserReview>('users/' + data.id + '/review').snapshotChanges().pipe(
              map(reviews => {
                return reviews.map(a => {
                  const review = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return { id, ...review };
                });
              })
            ).subscribe(review => {
              this.userReview = review;
            });

            // Will be used later
            // this.db.collection<WisataPhoto>('users/' + data.id + '/photos').snapshotChanges().pipe(
            //   map(reviews => {
            //     return reviews.map(a => {
            //       const review = a.payload.doc.data();
            //       const id = a.payload.doc.id;
            //       return { id, ...review };
            //     });
            //   })
            // ).subscribe(photos => {
            //   this.userPhotos = photos;
            // });
          });
        }
      }
    }, 200);
  }

  ngOnInit() {
  }

  updateProfilePhoto() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 75
    }).then((res) => {
      this.presentLoading();
      const url = 'data:image/jpeg;base64,' + res;
      const imgBlob = this.storageService.convertDataUrltoBlob(url);
      const imgName = this.storageService.getRandomString();
      this.storageService.uploadToStorage(imgBlob, imgName, 'imageUser').then(
        snapshot => {
          snapshot.ref.getDownloadURL().then(downloadUrl => {
            this.user.photo = downloadUrl;
            this.userService.updatePhoto(downloadUrl);
          }, error => {
            console.log(error);
          });
        }
      );
    }).catch(e => {
      console.log(e);
    });
  }

  isLoggedIn() {
    return localStorage.getItem('name') === null ? false : true;
  }

  logOut() {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    this.router.navigateByUrl('/login');
  }

  async presentLoading() {
    const loading = await this.loadCtrl.create({
      message: 'Please wait...',
      duration: 1000
    });

    await loading.present();
  }

  toggleReview() {
    this.showReview = !this.showReview;
  }
}
