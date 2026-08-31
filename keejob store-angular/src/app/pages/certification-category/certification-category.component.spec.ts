import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationCategoryComponent } from './certification-category.component';

describe('CertificationCategoryComponent', () => {
  let component: CertificationCategoryComponent;
  let fixture: ComponentFixture<CertificationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificationCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
