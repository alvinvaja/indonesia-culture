import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataService } from 'src/app/services/wisata.service';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { StorageService } from 'src/app/services/storage.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { WisataPhoto } from 'src/app/models/wisataPhoto.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  wisata: Wisata;
  backUrl: string;
  url: string;

  constructor(
    private wisataService: WisataService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private loadCtrl: LoadingController,
    private camera: Camera,
    private storageService: StorageService,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
    this.wisata = this.wisataService.getDummy();
    this.url = '';
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('wisataId')) { return; }
      const wisataId = paramMap.get('wisataId');
      this.backUrl = 'tabs/home/' + wisataId;

      this.wisataService.getAllWisatas().pipe(take(1)).subscribe(res => {
        res.forEach(data => {
          if (data.id === wisataId) {
            this.wisata = data;
          }
        });
      });
    });
  }

  choosePhoto() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 600,
      targetHeight: 400
    }).then((res) => {
      this.url = 'data:image/jpeg;base64,' + res;
    }).catch(e => {
      console.log(e);
    });
  }

  uploadPhoto() {
    this.presentLoading();
    const url = 'data:image/jpeg;base64,' + this.url;
    const imgBlob = this.storageService.convertDataUrltoBlob(url);
    this.storageService.uploadToStorage(imgBlob, 'imageWisata').then(
      snapshot => {
        snapshot.ref.getDownloadURL().then(downloadUrl => {
          this.db.collection<WisataPhoto>('wisata/' + this.wisata.id + '/photos').add({
            photo: downloadUrl
          });
          this.userService.getSingleUser(localStorage.getItem('email')).pipe(take(1)).subscribe(res => {
            const data = res[0];
            this.db.collection('users').doc(data.id).collection('photos').add({
              photo: downloadUrl
            });
          });
        });
      }, error => {
        console.log(error);
      });
  }

  async presentLoading() {
    const loading = await this.loadCtrl.create({
      message: 'Please wait...',
      duration: 1500
    });

    await loading.present();
  }
}
