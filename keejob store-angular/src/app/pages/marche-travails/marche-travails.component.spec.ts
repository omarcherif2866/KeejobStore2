import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcheTravailsComponent } from './marche-travails.component';

describe('MarcheTravailsComponent', () => {
  let component: MarcheTravailsComponent;
  let fixture: ComponentFixture<MarcheTravailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcheTravailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcheTravailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
