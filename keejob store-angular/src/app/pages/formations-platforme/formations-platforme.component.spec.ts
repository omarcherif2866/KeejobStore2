import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsPlatformeComponent } from './formations-platforme.component';

describe('FormationsPlatformeComponent', () => {
  let component: FormationsPlatformeComponent;
  let fixture: ComponentFixture<FormationsPlatformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationsPlatformeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationsPlatformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
