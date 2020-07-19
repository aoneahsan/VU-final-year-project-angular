import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookHallComponent } from './book-hall.component';

describe('BookHallComponent', () => {
  let component: BookHallComponent;
  let fixture: ComponentFixture<BookHallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookHallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
