import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserReview } from 'src/app/models/userReview.model';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;
  userReview: UserReview[];

  constructor(
    private userService: UsersService,
    private router: Router,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.user = { id: '', name: '-', age: 0, contribution: 0, email: '-', reviewCounter: 0, photo: '' };
    if (localStorage.getItem('email') !== null) {
      this.userService.getAllUsers().subscribe(res => {
        this.user = res.filter(user => {
          return user.email === localStorage.getItem('email');
        })[0];
      });
    }

    this.userService.getUserReviews().pipe(take(1)).subscribe(res => {
      const data = res[0];
      this.db.collection<UserReview>('users/' + data.id + '/review').snapshotChanges().pipe(
        map(reviews => {
          return reviews.map(a => {
            const review = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...review };
          });
        })
      ).subscribe(review => {
        this.userReview = review;
      });
    });
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
