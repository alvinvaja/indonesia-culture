import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WisataDetailPageRoutingModule } from './wisata-detail-routing.module';

import { WisataDetailPage } from './wisata-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WisataDetailPageRoutingModule
  ],
  declarations: [WisataDetailPage]
})
export class WisataDetailPageModule {}
