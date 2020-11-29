import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataPhoto } from 'src/app/models/wisataPhoto.model';
import { WisataService } from 'src/app/services/wisata.service';

@Component({
  selector: 'app-history',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  wisata: Wisata;
  backUrl: string;
  wisataPhoto: WisataPhoto[] = [];
  constructor(
    private wisataService: WisataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.wisata = this.wisataService.getDummy();
    this.wisataPhoto = [];
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('wisataId')) { return; }
      const wisataId = paramMap.get('wisataId');
      this.wisataService.getAllWisatas().subscribe(res => {
        res.forEach(data => {
          if (data.id === wisataId) {
            this.wisata = data;
            this.backUrl = '/tabs/home/' + wisataId + '/more';
          }
        });
      });

      this.wisataService.getWisataPhotos(wisataId).subscribe(res => {
        this.wisataPhoto = res;
      });
    });
  }
}
