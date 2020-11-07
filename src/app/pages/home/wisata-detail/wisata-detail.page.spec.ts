import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WisataDetailPage } from './wisata-detail.page';

describe('WisataDetailPage', () => {
  let component: WisataDetailPage;
  let fixture: ComponentFixture<WisataDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WisataDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WisataDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
