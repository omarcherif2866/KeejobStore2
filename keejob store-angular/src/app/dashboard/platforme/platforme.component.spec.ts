import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformeComponent } from './platforme.component';

describe('PlatformeComponent', () => {
  let component: PlatformeComponent;
  let fixture: ComponentFixture<PlatformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
