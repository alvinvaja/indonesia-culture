import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Wisata } from 'src/app/models/wisata.model';
import { UsersService } from 'src/app/services/users.service';
import { WisataService } from 'src/app/services/wisata.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  wisata: Wisata;
  backUrl: string;
  formRating: number;

  constructor(
    private wisataService: WisataService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.wisata = this.wisataService.getDummy();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('wisataId')) { return; }
      const wisataId = paramMap.get('wisataId');
      this.wisataService.getAllWisatas().subscribe(res => {
        res.forEach(data => {
          if (data.id === wisataId) {
            this.wisata = data;
            this.backUrl = '/tabs/home/' + wisataId;
          }
        });
      });
    });
  }

  onSubmit(form: NgForm) {
    if (!form.value.rating || !form.value.review) {
      // TODO: alert invalid form
      return;
    }

    const wisataReview = {
      email: localStorage.getItem('email'),
      rating: form.value.rating,
      review: form.value.review,
      wisata: this.wisata
    };

    const userReview = {
      rating: form.value.rating,
      review: form.value.review,
      wisataName: this.wisata.name,
      wisataPhoto: this.wisata.photo
    };

    this.wisataService.addWisataReview(wisataReview);
    this.userService.addUserReview(userReview);
    this.presentToast();

    this.router.navigateByUrl(this.backUrl);
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Review submitted successfully!',
      duration: 1000
    });

    await toast.present();
  }
}
