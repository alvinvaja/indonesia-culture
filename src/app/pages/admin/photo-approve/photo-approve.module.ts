import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoApprovePageRoutingModule } from './photo-approve-routing.module';

import { PhotoApprovePage } from './photo-approve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoApprovePageRoutingModule
  ],
  declarations: [PhotoApprovePage]
})
export class PhotoApprovePageModule {}
