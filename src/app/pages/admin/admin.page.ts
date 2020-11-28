import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  IonItemSliding,
  ModalController,
} from "@ionic/angular";
import { CityModalComponent } from "src/app/components/city-modal/city-modal.component";
import { Wisata } from "src/app/models/wisata.model";
import { WisataService } from "src/app/services/wisata.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.scss"],
})
export class AdminPage implements OnInit {
  public wisatas: Wisata[];
  public defaultPlace: string;
  public now: Date = new Date();
  public username: string;
  public id: string;

  constructor(
    private wisataService: WisataService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {
    setInterval(() => {
      this.now = new Date();
      this.username =
        localStorage.getItem("name") === null
          ? ""
          : localStorage.getItem("name");
    }, 2);
  }

  ngOnInit() {
    this.defaultPlace = "Jakarta";
    this.subscribeWisata();
  }

  ionViewWillEnter() {
    if (this.username === "") {
      this.router.navigateByUrl("/tabs/home");
    }
  }

  async showCity() {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent,
    });

    modal.onDidDismiss().then((resultData) => {
      this.defaultPlace = resultData.data.city;
      this.subscribeWisata();
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

  logOut() {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    this.router.navigateByUrl("/login");
  }

  async deleteData(wisataId: string): Promise<void> {
    const alert = await this.alertController.create({
      message: "Are you sure you want to delete?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: () => {
            this.wisataService.delete(wisataId).then(() => {
              this.router.navigateByUrl("");
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
