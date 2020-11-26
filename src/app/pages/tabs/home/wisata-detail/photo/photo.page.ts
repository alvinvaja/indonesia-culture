import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataService } from 'src/app/services/wisata.service';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';

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
    private activatedRoute: ActivatedRoute,
    private loadCtrl: LoadingController,
    private camera: Camera
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
      this.presentLoading();
    }).catch(e => {
      console.log(e);
    });
  }

  uploadPhoto() {
    console.log('upload photo');
  }

  async presentLoading() {
    const loading = await this.loadCtrl.create({
      message: 'Please wait...',
      duration: 1000
    });

    await loading.present();
  }
}
