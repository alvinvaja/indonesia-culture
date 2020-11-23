import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditWisataPage } from './edit-wisata.page';

const routes: Routes = [
  {
    path: '',
    component: EditWisataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditWisataPageRoutingModule {}
