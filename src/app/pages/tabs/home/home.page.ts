import { Component, OnInit } from '@angular/core';
import { Wisata } from 'src/app/models/wisata.model';
import { WisataService } from 'src/app/services/wisata.service';
import firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public wisatas: Wisata[];
  defaultPlace = 'Jakarta';
  constructor(
    private wisataService: WisataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.wisataService.getAllWisatas().subscribe(res => {
      this.wisatas = res;
    });
  }
}
