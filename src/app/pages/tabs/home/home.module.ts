import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HomePageRoutingModule,
    MatAutocompleteModule,
    MatInputModule,
    ScrollingModule
  ],
  declarations: [HomePage, CityModalComponent]
})
export class HomePageModule {}
