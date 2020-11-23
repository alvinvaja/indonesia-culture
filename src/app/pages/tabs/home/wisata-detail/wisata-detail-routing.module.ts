import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WisataDetailPage } from './wisata-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WisataDetailPage
  },
  {
    path: 'more',
    loadChildren: () => import('./more/more.module').then( m => m.MorePageModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule)
  },
  {
    path: 'photo',
    loadChildren: () => import('./photo/photo.module').then( m => m.PhotoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WisataDetailPageRoutingModule {}
