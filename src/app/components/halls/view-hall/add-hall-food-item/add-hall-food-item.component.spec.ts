import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHallFoodItemComponent } from './add-hall-food-item.component';

describe('AddHallFoodItemComponent', () => {
  let component: AddHallFoodItemComponent;
  let fixture: ComponentFixture<AddHallFoodItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHallFoodItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHallFoodItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
