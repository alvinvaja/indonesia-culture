import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  public users: User[];
  public currentName = '';
  constructor(
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.currentName = localStorage.getItem('name') === null ? '' : localStorage.getItem('name');
    this.users = [];
    this.userService.getAllUsers().subscribe(res => {
      this.users = res.filter(data => {
        return data.email !== 'admin@mailnator.com';
      });
      this.users.sort( (a, b) => {
        if (a.contribution > b.contribution) {
          return -1;
        } else {
          return 1;
        }
      });
    });
  }

}
