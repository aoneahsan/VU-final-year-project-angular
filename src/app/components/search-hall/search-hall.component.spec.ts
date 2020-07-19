import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHallComponent } from './search-hall.component';

describe('SearchHallComponent', () => {
  let component: SearchHallComponent;
  let fixture: ComponentFixture<SearchHallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
