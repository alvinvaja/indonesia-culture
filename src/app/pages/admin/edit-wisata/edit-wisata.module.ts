import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditWisataPageRoutingModule } from './edit-wisata-routing.module';

import { EditWisataPage } from './edit-wisata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditWisataPageRoutingModule
  ],
  declarations: [EditWisataPage]
})
export class EditWisataPageModule {}
