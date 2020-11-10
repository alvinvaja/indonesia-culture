import { Component, OnInit } from '@angular/core';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataService } from 'src/app/services/wisata.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public wisatas: Wisata[];
  public defaultPlace: string;
  constructor(
    private wisataService: WisataService,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.defaultPlace = 'Jakarta';
    this.subscribeWisata();
  }

  async showCity() {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
    });

    modal.onDidDismiss().then(resultData => {
      this.defaultPlace = resultData.data.city;
      this.subscribeWisata();
    });

    return await modal.present();
  }

  subscribeWisata() {
    this.wisataService.getAllWisatas().subscribe(res => {
      this.wisatas = res;
      this.wisatas = this.filterCity();
    });
  }

  filterCity() {
    return this.wisatas.filter(wisata => {
      return wisata.city === this.defaultPlace;
    });
  }
}
