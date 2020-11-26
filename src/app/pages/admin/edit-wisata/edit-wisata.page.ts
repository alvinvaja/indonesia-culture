import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs/operators";
import { Wisata } from "src/app/models/wisata.model";
import { WisataService } from "src/app/services/wisata.service";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-edit-wisata",
  templateUrl: "./edit-wisata.page.html",
  styleUrls: ["./edit-wisata.page.scss"],
})
export class EditWisataPage implements OnInit {
  validationForm: FormGroup;
  username: string;
  wisata: Wisata;
  router: Router;
  loadingCtrl: LoadingController;

  constructor(
    private wisataService: WisataService,
    private activatedRoute: ActivatedRoute
  ) {
    setInterval(() => {
      this.username =
        localStorage.getItem("name") === null
          ? ""
          : localStorage.getItem("name");
    }, 2);
  }

  ngOnInit() {
    this.username = "";
    this.wisata = this.wisataService.getDummy();
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("id")) {
        return;
      }
      const id = paramMap.get("id");

      this.wisataService
        .getAllWisatas()
        .pipe(take(1))
        .subscribe((res) => {
          res.forEach((data) => {
            if (data.id === id) {
              this.wisata = data;
              console.log(this.wisata);
            }
          });
        });
    });
  }
  update(recordRow) {
    let record = {};
    record["address"] = recordRow.address;
    record["city"] = recordRow.city;
    record["closeHour"] = recordRow.closeHour;
    record["description"] = recordRow.description;
    record["history"] = recordRow.history;
    record["name"] = recordRow.name;
    record["photo"] = recordRow.photo;
    record["price"] = recordRow.price;
    record["latitude"] = recordRow.latitude;
    record["longtitude"] = recordRow.longtitude;
    this.wisataService.update_wisata(recordRow.id, record);
  }
}
