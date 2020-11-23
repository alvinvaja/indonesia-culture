import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataService } from 'src/app/services/wisata.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  wisata: Wisata;
  backUrl: string;
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
            this.backUrl = '/tabs/home/' + wisataId;
          }
        });
      });
    });
  }
}
