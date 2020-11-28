import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataService } from 'src/app/services/wisata.service';
import { take } from 'rxjs/operators';
import { LoadingController, ToastController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { StorageService } from 'src/app/services/storage.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { WisataPhoto } from 'src/app/models/wisataPhoto.model';
import { UsersService } from 'src/app/services/users.service';
import { UploadPhoto } from 'src/app/models/uploadPhoto.model';

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
    private toastCtrl: ToastController,
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
      quality: 75
    }).then((res) => {
      this.url = 'data:image/jpeg;base64,' + res;
    }).catch(e => {
      console.log(e);
    });
  }

  async uploadPhoto() {
    const loading = await this.loadCtrl.create({
      message: 'Uploading Photo...'
    });
    await loading.present();

    const url = 'data:image/jpeg;base64,' + this.url;
    const imgBlob = this.storageService.convertDataUrltoBlob(url);
    const imgName = this.storageService.getRandomString();
    this.storageService.uploadToStorage(imgBlob, imgName, 'uploadWisata').then(
      snapshot => {
        snapshot.ref.getDownloadURL().then(downloadUrl => {
          this.db.collection('uploads').add({
            photo: downloadUrl,
            photoName: imgName,
            wisataId: this.wisata.id,
            wisataName: this.wisata.name,
            userName: localStorage.getItem('name'),
            userEmail: localStorage.getItem('email')
          });
          loading.dismiss();
          this.presentToast();
        });
      }, error => {
        console.log(error);
      });
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Image submitted successfully!',
      duration: 1500
    });

    await toast.present();
  }
}
