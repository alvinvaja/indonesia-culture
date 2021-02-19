import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  wisata: Wisata;
  backUrl: string;
  url: string;

  @ViewChild('f', null) f: NgForm;

  constructor(
    private wisataService: WisataService,
    private toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private loadCtrl: LoadingController,
    private camera: Camera,
    private sanitizer: DomSanitizer,
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
      this.url = this.sanitizer.sanitize(SecurityContext.URL, this.photo);
    };

    reader.readAsDataURL(file);
  }

  async uploadPhoto() {
    const loading = await this.loadCtrl.create({
      message: 'Uploading Photo...'
    });
    await loading.present();
    const imgBlob = this.storageService.convertDataUrltoBlob(this.url);
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
