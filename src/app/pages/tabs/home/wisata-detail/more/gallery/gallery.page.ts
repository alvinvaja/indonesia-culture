import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataPhoto } from 'src/app/models/wisataPhoto.model';
import { WisataService } from 'src/app/services/wisata.service';

@Component({
  selector: 'app-history',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  wisata: Wisata;
  wisataId: string;
  backUrl: string;
  wisataPhoto: WisataPhoto[] = [];
  constructor(
    private wisataService: WisataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.wisata = this.wisataService.getDummy();
    this.wisataPhoto = [];
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('wisataId')) { return; }
      const wisataId = paramMap.get('wisataId');
      this.wisataId = wisataId;
      this.wisataService.getAllWisatas().subscribe(res => {
        res.forEach(data => {
          if (data.id === wisataId) {
            this.wisata = data;
            this.backUrl = '/tabs/home/' + wisataId + '/more';
          }
        });
      });

      this.wisataService.getWisataPhotos(wisataId).subscribe(res => {
        this.wisataPhoto = res;
      });
    });
  }

  isLoggedIn() {
    return localStorage.getItem('name') === null ? false : true;
  }

  goToPhoto() {
    if (!this.isLoggedIn()) {
      this.presentAlert();
      return;
    }

    this.router.navigateByUrl('/tabs/home/' + this.wisataId + '/photo');
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      message: 'You need to login to continue this action.',
      buttons: [
        {
          text: 'Ok'
        },
        {
          text: 'Go to Login',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });

    await alert.present();
  }
}
