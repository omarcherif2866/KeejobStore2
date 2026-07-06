import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcheTravailsDetailsComponent } from './marche-travails-details.component';

describe('MarcheTravailsDetailsComponent', () => {
  let component: MarcheTravailsDetailsComponent;
  let fixture: ComponentFixture<MarcheTravailsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcheTravailsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcheTravailsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
