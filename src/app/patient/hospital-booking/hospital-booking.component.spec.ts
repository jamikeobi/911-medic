import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalBookingComponent } from './hospital-booking.component';

describe('HospitalBookingComponent', () => {
  let component: HospitalBookingComponent;
  let fixture: ComponentFixture<HospitalBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HospitalBookingComponent]
    });
    fixture = TestBed.createComponent(HospitalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
