import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditWisataPage } from './edit-wisata.page';

describe('EditWisataPage', () => {
  let component: EditWisataPage;
  let fixture: ComponentFixture<EditWisataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWisataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditWisataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
