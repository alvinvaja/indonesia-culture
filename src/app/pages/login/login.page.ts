import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: NgForm;
  private usersSubscription: Subscription;
  private users: User[];
  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  onSubmit(form: NgForm) {
    const user = { email: form.value.email, password: form.value.password };

    if (this.login(user)) {
      console.log('Success');
    } else {
      console.log('Failed');
    }
  }

  login(user: User) {
    let success = false;

    this.users.forEach(data => {
      if (data.email === user.email && data.password === user.password) {
        success = true;
      }
    });

    return success;
  }
}
