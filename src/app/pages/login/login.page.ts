import { AuthenticateService } from './../../services/authentication.service';
// login.page.ts
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/users.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  singleUser: User;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
  }

  loginUser(value) {
    this.authService.loginUser(value).then(
      (res) => {
        console.log(res);
        this.errorMessage = '';
        this.createLoginSession(value.email);
        if (value.email === 'admin@mailnator.com') {
          this.navCtrl.navigateForward('/admin');
        } else {
          this.navCtrl.navigateForward('/tabs/home');
        }
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

  createLoginSession(userEmail) {
    this.userService
      .getAllUsers()
      .pipe(take(1))
      .subscribe((res) => {
        const filterUser = res.filter((user) => {
          return user.email === userEmail;
        })[0];
        this.triggerLoginPopUp(filterUser);
        localStorage.setItem('email', filterUser.email);
        localStorage.setItem('name', filterUser.name);
      });
  }

  async triggerLoginPopUp(user: User) {
    const toast = await this.toastCtrl.create({
      message: 'Welcome Back, ' + user.name + '!',
      duration: 2000,
    });

    toast.present();
  }
}
