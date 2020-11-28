import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Wisata } from "src/app/models/wisata.model";
import { WisataReview } from "src/app/models/wisataReview.model";
import { WisataService } from "src/app/services/wisata.service";
import { take } from "rxjs/operators";
import { AlertController } from '@ionic/angular';

@Component({
  selector: "app-wisata-detail",
  templateUrl: "./wisata-detail.page.html",
  styleUrls: ["./wisata-detail.page.scss"],
})
export class WisataDetailPage implements OnInit {
  username: string;
  wisata: Wisata;
  wisataId: string;
  wisataReview: WisataReview[] = [];
  constructor(
    private wisataService: WisataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    setInterval(() => {
      this.username =
        localStorage.getItem("name") === null
          ? ""
          : localStorage.getItem("name");
    }, 2);
  }

  ngOnInit() {
    this.username = this.wisataId = "";
    this.wisata = this.wisataService.getDummy();
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("wisataId")) {
        return;
      }
      const wisataId = paramMap.get("wisataId");
      this.wisataId = wisataId;

      this.wisataService
        .getAllWisatas()
        .pipe(take(1))
        .subscribe((res) => {
          res.forEach((data) => {
            if (data.id === wisataId) {
              this.wisata = data;
              console.log(this.wisata);
            }
          });
        });

      this.wisataService.getWisataReviews(wisataId).subscribe((res) => {
        this.wisataReview = res;
      });
    });
  }

  uploadPhoto() {
    if (!this.isLoggedIn()) {
      this.presentAlert();
      return;
    }

    this.router.navigateByUrl('/tabs/home/' + this.wisataId + '/photo');
  }

  isLoggedIn() {
    return localStorage.getItem('name') === null ? false : true;
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
