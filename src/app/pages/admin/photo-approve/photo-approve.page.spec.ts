import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhotoApprovePage } from './photo-approve.page';

describe('PhotoApprovePage', () => {
  let component: PhotoApprovePage;
  let fixture: ComponentFixture<PhotoApprovePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoApprovePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoApprovePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
