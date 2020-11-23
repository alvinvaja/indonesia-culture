import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateWisataPage } from './create-wisata.page';

const routes: Routes = [
  {
    path: '',
    component: CreateWisataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateWisataPageRoutingModule {}
