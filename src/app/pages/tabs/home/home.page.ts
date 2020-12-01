import { Component, OnInit, ViewChild } from "@angular/core";
import { Wisata } from "src/app/models/wisata.model";
import { WisataService } from "src/app/services/wisata.service";
import firebase from "firebase";
import { Router } from "@angular/router";
import { AlertController, IonContent, ModalController, Platform } from "@ionic/angular";
import { CityModalComponent } from "src/app/components/city-modal/city-modal.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public wisatas: Wisata[];
  public defaultPlace: string;
  public now: Date = new Date();
  public username: string;
  public backToTop = false;

  constructor(
    private wisataService: WisataService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
    setInterval(() => {
      this.now = new Date();
      this.username =
        localStorage.getItem("name") === null
          ? ""
          : localStorage.getItem("name");
    }, 1);
  }

  ngOnInit() {
    this.defaultPlace = "Jakarta";
    this.subscribeWisata();
  }

  async showCity() {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent,
    });

    modal.onDidDismiss().then((resultData) => {
      if (resultData.data.city !== 'cancel') {
        this.defaultPlace = resultData.data.city;
        this.subscribeWisata();
      }
    });

    return await modal.present();
  }

  subscribeWisata() {
    this.wisataService.getAllWisatas().subscribe((res) => {
      this.wisatas = res;
      this.wisatas = this.filterCity();
    });
  }

  filterCity() {
    return this.wisatas.filter((wisata) => {
      return wisata.city === this.defaultPlace;
    });
  }

  isWisataOpen(wisata: Wisata) {
    const start = this.extractTimetoNumber(wisata.openHour);
    const end = this.extractTimetoNumber(wisata.closeHour);

    const hour = this.now.getHours();
    let hourString = String(this.now.getHours());
    if (hour < 10) {
      hourString = "0" + hourString;
    }

    const minute = this.now.getMinutes();
    let minuteString = String(this.now.getMinutes());
    if (minute < 10) {
      minuteString = "0" + minuteString;
    }
    const now = this.extractTimetoNumber(
      String(hourString + ":" + minuteString)
    );

    return now >= start && now <= end;
  }

  isLoggedIn() {
    return localStorage.getItem("name") === null ? false : true;
  }

  extractTimetoNumber(waktu: string) {
    const hour = Number(waktu.substring(0, 2));
    const minute = Number(waktu.substring(3));

    return hour * 3600 + minute * 60;
  }

  async logOut() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            this.router.navigateByUrl("/login");
          }
        },
        {
          text: 'No'
        }
      ]
    });

    await alert.present();
  }

  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
      this.backToTop = true;
    } else {
      this.backToTop = false;
    }
  }

  gotToTop() {
    this.content.scrollToTop(1000);
  }
}
