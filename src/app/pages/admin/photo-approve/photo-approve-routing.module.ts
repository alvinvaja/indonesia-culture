import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoApprovePage } from './photo-approve.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoApprovePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoApprovePageRoutingModule {}
