import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HallBookingsComponent } from './hall-bookings.component';

describe('HallBookingsComponent', () => {
  let component: HallBookingsComponent;
  let fixture: ComponentFixture<HallBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HallBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
