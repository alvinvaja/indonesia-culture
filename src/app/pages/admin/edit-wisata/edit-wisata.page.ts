import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs/operators";
import { Wisata } from "src/app/models/wisata.model";
import { WisataService } from "src/app/services/wisata.service";
import { FormGroup } from "@angular/forms";
import { Camera } from '@ionic-native/camera/ngx';
import { StorageService } from 'src/app/services/storage.service';

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
    private activatedRoute: ActivatedRoute,
    private camera: Camera,
    private storageService: StorageService
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
    const record = {};
    record["address"] = recordRow.address;
    record["city"] = recordRow.city;
    record["closeHour"] = recordRow.closeHour;
    record["description"] = recordRow.description;
    record["history"] = recordRow.history;
    record["name"] = recordRow.name;
    record["photo"] = this.wisata.photo;
    record["price"] = recordRow.price;
    record["latitude"] = recordRow.latitude;
    record["longtitude"] = recordRow.longtitude;

    if (this.wisata.photo.length <= 50) {
      const imgBlob = this.storageService.convertDataUrltoBlob(this.wisata.photo);
      const imgName = this.storageService.getRandomString();
      this.storageService.uploadToStorage(imgBlob, imgName, 'imageWisata').then(
        snapshot => {
          snapshot.ref.getDownloadURL().then(downloadUrl => {
            record["photo"] = downloadUrl;
            this.wisataService.update_wisata(recordRow.id, record);
          });
        });
    } else {
      this.wisataService.update_wisata(recordRow.id, record);
    }
  }

  changePhoto() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 75
    }).then(res => {
      this.wisata.photo = 'data:image/jpeg;base64,' + res;
    }).catch(e => {
      console.log(e);
    });
  }
}
