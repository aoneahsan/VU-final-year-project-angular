import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHallFeatureItemComponent } from './add-hall-feature-item.component';

describe('AddHallFeatureItemComponent', () => {
  let component: AddHallFeatureItemComponent;
  let fixture: ComponentFixture<AddHallFeatureItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHallFeatureItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHallFeatureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
