import { CreateWisataService } from "./../../../services/create-wisata.service";
import { Router } from "@angular/router";
// register.page.ts
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LoadingController, NavController } from "@ionic/angular";

@Component({
  selector: "app-create-wisata",
  templateUrl: "./create-wisata.page.html",
  styleUrls: ["./create-wisata.page.scss"],
})
export class CreateWisataPage implements OnInit {
  validationForm: FormGroup;
  errorMessage = "";
  successMessage = "";

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
    rating: [{ type: "required", message: "rating is required" }],
    reviewCounter: [{ type: "required", message: "reviewCounter is required" }],
  };

  constructor(
    private CreateWisataService: CreateWisataService,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
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
      rating: new FormControl("", Validators.compose([Validators.required])),
      reviewCounter: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
    });
  }

  tryCreateWisata(value: any) {
    this.createWisata();
  }

  async createWisata() {
    const loading = await this.loadingCtrl.create();

    const address = this.validationForm.value.address;
    const city = this.validationForm.value.city;
    const closeHour = this.validationForm.value.closeHour;
    const description = this.validationForm.value.description;
    const history = this.validationForm.value.history;
    const name = this.validationForm.value.name;
    const openHour = this.validationForm.value.openHour;
    const photo = this.validationForm.value.photo;
    const price = this.validationForm.value.price;
    const rating = this.validationForm.value.rating;
    const reviewCounter = this.validationForm.value.reviewCounter;

    this.CreateWisataService.registerToFireStore(
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
      reviewCounter
    );
    this.router.navigateByUrl("/tabs/admin");
  }
}
