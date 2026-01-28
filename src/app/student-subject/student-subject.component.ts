import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface StudentSubject {
  studentId: number;
  subjectId: number;
  grade: number;
  annee: number;
}

@Component({
  selector: 'app-student-subject',
  standalone: true,
  imports: [NgFor, NgIcon, NgIf, ReactiveFormsModule, HttpClientModule],
  providers: [
    provideIcons({
      heroPencilSquare,
      heroTrash,
    }),
  ],
  templateUrl: './student-subject.component.html',
  styleUrl: './student-subject.component.css',
})
export class StudentSubjectComponent {
  studentId!: number;
  studentName = '';

  studentSubjects: StudentSubject[] = [];

  subjects = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Informatics' },
  ];

  form: FormGroup;

  isEditing = false;
  editingIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.studentId = Number(this.route.snapshot.paramMap.get('studentId'));

    const nav = this.router.getCurrentNavigation();
    this.studentName = nav?.extras?.state?.['studentName'] ?? 'Student';

    this.form = this.fb.group({
      subjectId: ['', Validators.required],
      grade: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      annee: [
        '',
        [
          Validators.required,
          Validators.min(2000),
          Validators.max(new Date().getFullYear() + 1),
        ],
      ],
    });
  }

  addGrade() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const grade: StudentSubject = {
      studentId: this.studentId,
      subjectId: Number(this.form.value.subjectId),
      grade: this.form.value.grade,
      annee: this.form.value.annee,
    };

    // EDIT MODE
    if (this.isEditing && this.editingIndex !== null) {
      this.studentSubjects[this.editingIndex] = grade;

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        timer: 1200,
        showConfirmButton: false,
      });

      this.resetForm();
      return;
    }

    // DUPLICATE CHECK
    const exists = this.studentSubjects.some(
      (ss) => ss.subjectId === grade.subjectId && ss.annee === grade.annee,
    );

    if (exists) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate',
        text: 'This subject already exists for this year',
      });
      return;
    }

    this.studentSubjects.push(grade);

    Swal.fire({
      icon: 'success',
      title: 'Added',
      timer: 1200,
      showConfirmButton: false,
    });

    this.resetForm();
  }

  editGrade(ss: StudentSubject, index: number) {
    this.isEditing = true;
    this.editingIndex = index;

    this.form.patchValue({
      subjectId: ss.subjectId,
      grade: ss.grade,
      annee: ss.annee,
    });
  }

  deleteByIndex(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This grade will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentSubjects.splice(index, 1);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  }

  resetForm() {
    this.form.reset({ annee: new Date().getFullYear() });
    this.isEditing = false;
    this.editingIndex = null;
  }

  getSubjectName(id: number): string {
    return this.subjects.find((s) => s.id === id)?.name || '';
  }
}
