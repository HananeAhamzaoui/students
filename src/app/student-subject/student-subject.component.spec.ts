import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubjectComponent } from './student-subject.component';

describe('StudentSubjectComponent', () => {
  let component: StudentSubjectComponent;
  let fixture: ComponentFixture<StudentSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSubjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
