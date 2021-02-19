import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserReview } from 'src/app/models/userReview.model';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import { map, take } from 'rxjs/operators';
import { Camera } from '@ionic-native/camera/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataPhoto } from 'src/app/models/wisataPhoto.model';
import { StorageService } from 'src/app/services/storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  user: User;
  userReview: UserReview[] = [];
  userPhotos: WisataPhoto[] = [];
  interval: any;
  showReview: boolean;

  @ViewChild('f', null) f: NgForm;

  constructor(
    private userService: UsersService,
    private router: Router,
    private db: AngularFirestore,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    private loadCtrl: LoadingController,
    private storageService: StorageService
  ) {
    this.user = { id: '', name: '-', age: 0, contribution: 0, email: '-', reviewCounter: 0, photo: '' };
    this.userPhotos = [];
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

            this.db.collection<WisataPhoto>('users/' + data.id + '/photos').snapshotChanges().pipe(
              map(reviews => {
                return reviews.map(a => {
                  const review = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return { id, ...review };
                });
              })
            ).subscribe(photos => {
              this.userPhotos = photos;
            });
          });
        }
      }
    }, 200);
  }

  ngOnInit() {
  }

  updateProfilePhoto() {
    this.filePickerRef.nativeElement.click();
  }

  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();

      const url = this.sanitizer.sanitize(SecurityContext.URL, this.photo);
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
    };

    reader.readAsDataURL(file);
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
