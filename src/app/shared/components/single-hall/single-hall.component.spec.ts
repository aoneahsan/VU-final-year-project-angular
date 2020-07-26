import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHallComponent } from './single-hall.component';

describe('SingleHallComponent', () => {
  let component: SingleHallComponent;
  let fixture: ComponentFixture<SingleHallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleHallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
