import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataService } from 'src/app/services/wisata.service';

@Component({
  selector: 'app-wisata-detail',
  templateUrl: './wisata-detail.page.html',
  styleUrls: ['./wisata-detail.page.scss'],
})
export class WisataDetailPage implements OnInit {
  wisata: Wisata;
  constructor(
    private wisataService: WisataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.wisata = this.wisataService.getDummy();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('wisataId')) { return; }
      const wisataId = paramMap.get('wisataId');
      this.wisataService.getAllWisatas().subscribe(res => {
        res.forEach(data => {
          if (data.id === wisataId) {
            this.wisata = data;
          }
        });
      });
    });
  }
}
