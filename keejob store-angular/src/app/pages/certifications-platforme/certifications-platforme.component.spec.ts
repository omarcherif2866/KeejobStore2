import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsPlatformeComponent } from './certifications-platforme.component';

describe('CertificationsPlatformeComponent', () => {
  let component: CertificationsPlatformeComponent;
  let fixture: ComponentFixture<CertificationsPlatformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificationsPlatformeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationsPlatformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
