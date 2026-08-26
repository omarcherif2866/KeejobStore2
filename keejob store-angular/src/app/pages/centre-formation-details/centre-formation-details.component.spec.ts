import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreFormationDetailsComponent } from './centre-formation-details.component';

describe('CentreFormationDetailsComponent', () => {
  let component: CentreFormationDetailsComponent;
  let fixture: ComponentFixture<CentreFormationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentreFormationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreFormationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
