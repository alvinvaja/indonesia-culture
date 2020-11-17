import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataReview } from 'src/app/models/wisataReview.model';
import { WisataService } from 'src/app/services/wisata.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-wisata-detail',
  templateUrl: './wisata-detail.page.html',
  styleUrls: ['./wisata-detail.page.scss'],
})
export class WisataDetailPage implements OnInit {
  wisata: Wisata;
  wisataReview: WisataReview[] = [];
  constructor(
    private wisataService: WisataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.wisata = this.wisataService.getDummy();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('wisataId')) { return; }
      const wisataId = paramMap.get('wisataId');

      this.wisataService.getAllWisatas().pipe(take(1)).subscribe(res => {
        res.forEach(data => {
          if (data.id === wisataId) {
            this.wisata = data;
          }
        });
      });

      this.wisataService.getWisataReviews(wisataId).subscribe(res => {
        this.wisataReview = res;
      });
    });
  }
}
