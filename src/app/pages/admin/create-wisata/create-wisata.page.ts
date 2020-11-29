import { CreateWisataService } from "./../../../services/create-wisata.service";
import { Router } from "@angular/router";
import { Camera } from '@ionic-native/camera/ngx';
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LoadingController, NavController } from "@ionic/angular";
import { StorageService } from 'src/app/services/storage.service';
import firebase from 'firebase/app';

@Component({
  selector: "app-create-wisata",
  templateUrl: "./create-wisata.page.html",
  styleUrls: ["./create-wisata.page.scss"],
})
export class CreateWisataPage implements OnInit {
  validationForm: FormGroup;
  errorMessage = "";
  successMessage = "";
  photoUrl = "";

  validationMessages = {
    address: [{ type: "required", message: "address is required." }],
    city: [{ type: "required", message: "city is required." }],
    closeHour: [{ type: "required", message: "closeHour is required." }],
    description: [{ type: "required", message: "description is required" }],
    history: [{ type: "required", message: "history is required" }],
    name: [{ type: "required", message: "name is required" }],
    openHour: [{ type: "required", message: "openHour is required" }],
    photo: [{ type: "required", message: "photo is required" }],
    price: [{ type: "required", message: "price is required" }],
    latitude: [{ type: "required", message: "latitude is required" }],
    longtitude: [{ type: "required", message: "longtitude is required" }],
    // rating: [{ type: 'required', message: 'rating is required' }],
    // reviewCounter: [{ type: 'required', message: 'reviewCounter is required' }],
  };

  constructor(
    private createWisataService: CreateWisataService,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private camera: Camera,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.photoUrl = '';
    this.validationForm = this.formBuilder.group({
      address: new FormControl("", Validators.compose([Validators.required])),
      city: new FormControl("", Validators.compose([Validators.required])),
      closeHour: new FormControl("", Validators.compose([Validators.required])),
      description: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      history: new FormControl("", Validators.compose([Validators.required])),
      name: new FormControl("", Validators.compose([Validators.required])),
      openHour: new FormControl("", Validators.compose([Validators.required])),
      photo: new FormControl("", Validators.compose([Validators.required])),
      price: new FormControl("", Validators.compose([Validators.required])),
      latitude: new FormControl("", Validators.compose([Validators.required])),
      longtitude: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      // rating: new FormControl("", Validators.compose([Validators.required])),
      // reviewCounter: new FormControl(
      //   "",
      //   Validators.compose([Validators.required])
      // ),
    });
  }

  tryCreateWisata(value: any) {
    if (this.photoUrl === '') {
      return;
    }

    this.createWisata();
  }

  async createWisata() {
    const loading = await this.loadingCtrl.create();
    const imgBlob = this.storageService.convertDataUrltoBlob(this.photoUrl);
    const imgName = this.storageService.getRandomString();
    this.storageService.uploadToStorage(imgBlob, imgName, 'imageWisata').then(
      snapshot => {
        snapshot.ref.getDownloadURL().then(downloadUrl => {
          const address = this.validationForm.value.address;
          const city = this.validationForm.value.city;
          const closeHour = this.validationForm.value.closeHour;
          const description = this.validationForm.value.description;
          const history = this.validationForm.value.history;
          const name = this.validationForm.value.name;
          const openHour = this.validationForm.value.openHour;
          const price = this.validationForm.value.price;
          const photo = downloadUrl;
          const rating = 0;
          const reviewCounter = 0;
          const latitude = this.validationForm.value.latitude;
          const longtitude = this.validationForm.value.longtitude;
          this.createWisataService.registerToFireStore(
            address,
            city,
            closeHour,
            description,
            history,
            name,
            openHour,
            photo,
            price,
            rating,
            reviewCounter,
            latitude,
            longtitude
          );
          this.router.navigateByUrl("/admin");
        }, error => {
          console.log(error);
        });
      }
    );
  }

  addPhoto() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 75
    }).then(res => {
      this.photoUrl = 'data:image/jpeg;base64,' + res;
    }).catch(e => {
      console.log(e);
    });
  }
}
