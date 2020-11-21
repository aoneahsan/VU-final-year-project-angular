import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHallTimingComponent } from './add-hall-timing.component';

describe('AddHallTimingComponent', () => {
  let component: AddHallTimingComponent;
  let fixture: ComponentFixture<AddHallTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHallTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHallTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
