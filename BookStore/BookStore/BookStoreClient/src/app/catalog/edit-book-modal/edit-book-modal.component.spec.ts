import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookModalComponent } from './edit-book-modal.component';

describe('EditBookModalComponent', () => {
  let component: EditBookModalComponent;
  let fixture: ComponentFixture<EditBookModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBookModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
