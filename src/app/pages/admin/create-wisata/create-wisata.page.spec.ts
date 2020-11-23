import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateWisataPage } from './create-wisata.page';

describe('CreateWisataPage', () => {
  let component: CreateWisataPage;
  let fixture: ComponentFixture<CreateWisataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWisataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWisataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
