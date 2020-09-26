import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHallManagersComponent } from './manage-hall-managers.component';

describe('ManageHallManagersComponent', () => {
  let component: ManageHallManagersComponent;
  let fixture: ComponentFixture<ManageHallManagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHallManagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHallManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
