import { Router } from "@angular/router";
import { AuthenticateService } from "./../../services/authentication.service";
// register.page.ts
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LoadingController, NavController } from "@ionic/angular";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  validationForm: FormGroup;
  errorMessage = "";
  successMessage = "";

  validationMessages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
    name: [{ type: "required", message: "Name is required." }],
    age: [{ type: "required", message: "Age is required" }],
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      name: new FormControl("", Validators.compose([Validators.required])),
      age: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  tryRegister(value: any) {
    value.email = value.email.toLowerCase();
    this.authService.registerUser(value).then(
      (res) => {
        console.log(res);
        this.createuser();
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      }
    );
  }

  goLoginPage() {
    this.navCtrl.navigateBack("/login");
  }

  async createuser() {
    const loading = await this.loadingCtrl.create();

    const email = this.validationForm.value.email;
    const name = this.validationForm.value.name;
    const age = this.validationForm.value.age;
    const contribution = 0;

    this.userService.registerToFireStore(email, name, age, contribution);

    this.router.navigateByUrl("/login");
  }
}
