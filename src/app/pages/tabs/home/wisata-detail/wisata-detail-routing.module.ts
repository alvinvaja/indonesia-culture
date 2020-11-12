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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WisataDetailPageRoutingModule {}
