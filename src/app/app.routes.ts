import { Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { SubjectComponent } from './subject/subject.component';
import { ClassComponent } from './class/class.component';
import { StudentSubjectComponent } from './student-subject/student-subject.component';

export const routes: Routes = [
  { path: 'students', component: StudentComponent },
  { path: 'subjects', component: SubjectComponent },
  { path: 'classes', component: ClassComponent },
  { path: 'studentsubjects/:studentId', component: StudentSubjectComponent },
];
