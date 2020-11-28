import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminPage } from "./admin.page";

const routes: Routes = [
  {
    path: "",
    component: AdminPage,
  },
  {
    path: "create-wisata",
    loadChildren: () =>
      import("./create-wisata/create-wisata.module").then(
        (m) => m.CreateWisataPageModule
      ),
  },
  {
    path: 'edit-wisata/:id',
    loadChildren: () => import('./edit-wisata/edit-wisata.module').then( m => m.EditWisataPageModule)
  },  {
    path: 'photo-approve',
    loadChildren: () => import('./photo-approve/photo-approve.module').then( m => m.PhotoApprovePageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
