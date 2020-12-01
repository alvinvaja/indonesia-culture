import { Component, OnInit } from '@angular/core';
import { WisataService } from 'src/app/services/wisata.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss'],
})
export class CityModalComponent implements OnInit {
  formControl = new FormControl();
  cities: string[];
  filteredCities: Observable<string[]>;

  constructor(
    private wisataService: WisataService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.cities = this.wisataService.getHardCodeCity();
    this.filteredCities = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(city => this.filter(city))
      );
  }

  displayFn(city: string): string {
    return city ? city : '';
  }

  private filter(city: string): string[] {
    const filterValue = city.toLowerCase();

    return this.cities.filter(val => val.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit(form: FormControl) {
    if (!form.value || !this.validCity(form.value)) {
      this.presentAlert(form.value);
      return;
    }

    this.modalCtrl.dismiss({city: form.value}, 'confirm');
  }

  onCancel(form: FormControl) {
    this.modalCtrl.dismiss({city: 'cancel'}, 'cancel');
  }

  validCity(city: string) {
    let valid = false;
    this.cities.forEach(data => {
      valid = valid || (data === city);
    });

    return valid;
  }

  async presentAlert(city: string) {
    const alert = await this.alertCtrl.create({
      message: city ? 'City is not valid!' : 'City must not be empty!',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    await alert.present();
  }
}
