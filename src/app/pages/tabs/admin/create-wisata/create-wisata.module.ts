import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CreateWisataPageRoutingModule } from "./create-wisata-routing.module";

import { CreateWisataPage } from "./create-wisata.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateWisataPageRoutingModule,
  ],
  declarations: [CreateWisataPage],
})
export class CreateWisataPageModule {}
