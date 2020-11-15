import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;
  constructor(
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = { name: '-', age: 0, contribution: 0, email: '-' };
    if (localStorage.getItem('email') !== null) {
      this.userService.getAllUsers().subscribe(res => {
        this.user = res.filter(user => {
          return user.email === localStorage.getItem('email');
        })[0];
      });
    }
  }

  isLoggedIn() {
    return localStorage.getItem('name') === null ? false : true;
  }

  logOut() {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    this.router.navigateByUrl('/login');
  }
}
