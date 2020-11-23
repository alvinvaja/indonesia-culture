import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(public router: Router) {
    const email = localStorage.getItem('email') !== null ? localStorage.getItem('email') : '';
    setTimeout(() => {
      if (email === 'admin@mailnator.com') {
        this.router.navigateByUrl('tabs/admin');
      } else {
        this.router.navigateByUrl('tabs/home');
      }
    }, 4000);
  }

  ngOnInit() {
  }

}
