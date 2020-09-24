import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHallsApprovalComponent } from './manage-halls-approval.component';

describe('ManageHallsApprovalComponent', () => {
  let component: ManageHallsApprovalComponent;
  let fixture: ComponentFixture<ManageHallsApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHallsApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHallsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
