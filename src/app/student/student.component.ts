import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Student {
  id: number;
  name: string;
  phone: string;
  gender: 'male' | 'female';
  date: string;
  classId: number;
}

interface SchoolClass {
  id: number;
  nom: string;
  level: string;
  annee: number;
}

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [NgFor, NgIcon, NgIf, ReactiveFormsModule, HttpClientModule],
  providers: [
    provideIcons({
      heroPencilSquare,
      heroTrash,
    }),
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent {
  students: Student[] = [
    {
      id: 1,
      name: 'st1',
      phone: '0611111111',
      gender: 'female',
      date: '2001',
      classId: 1,
    },
    {
      id: 2,
      name: 'st2',
      phone: '0622222222',
      gender: 'female',
      date: '2002',
      classId: 2,
    },
    {
      id: 3,
      name: 'st3',
      phone: '0633333333',
      gender: 'male',
      date: '2003',
      classId: 1,
    },
    {
      id: 4,
      name: 'st4',
      phone: '0644444444',
      gender: 'female',
      date: '2004',
      classId: 2,
    },
    {
      id: 5,
      name: 'st5',
      phone: '0655555555',
      gender: 'male',
      date: '2005',
      classId: 1,
    },
  ];

  classes: SchoolClass[] = [
    { id: 1, nom: 'A', level: '1st Year', annee: 2024 },
    { id: 2, nom: 'B', level: '2nd Year', annee: 2024 },
    { id: 3, nom: 'C', level: '3rd Year', annee: 2024 },
    { id: 4, nom: 'D', level: 'Master', annee: 2024 },
  ];

  isEditing = false;
  isAdding = false;
  selectedId: number | null = null;
  selectedStudentId: number | null = null;
  showSubjects = false;

  addForm: FormGroup;
  modifierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)],
      ],
      gender: ['', Validators.required],
      date: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      classId: ['', Validators.required],
    });

    this.modifierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)],
      ],
      gender: ['', Validators.required],
      date: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      classId: ['', Validators.required],
    });
  }

  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  openSubjects(student: Student) {
    this.router.navigate(['/studentsubjects', student.id], {
      state: { studentName: student.name },
    });
  }

  getClassName(classId: number): string {
    const c = this.classes.find((cl) => cl.id === classId);
    return c ? `${c.nom} - ${c.level}` : '';
  }

  addStudent() {
    if (!this.isAdding) {
      this.addForm.reset();
      this.isAdding = true;
      return;
    }

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const newStudent: Student = {
      id: Math.max(...this.students.map((s) => s.id)) + 1,
      ...this.addForm.value,
      classId: Number(this.addForm.value.classId),
    };

    this.students.push(newStudent);

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'Student added successfully',
      timer: 1500,
      showConfirmButton: false,
    });

    this.cancelAdd();
  }

  cancelAdd() {
    this.addForm.reset();
    this.isAdding = false;
  }

  editStudent(student?: Student) {
    if (student) {
      this.selectedId = student.id;
      this.isEditing = true;
      this.modifierForm.patchValue(student);
      return;
    }

    if (this.modifierForm.valid && this.selectedId !== null) {
      const index = this.students.findIndex((s) => s.id === this.selectedId);

      if (index !== -1) {
        this.students[index] = {
          ...this.modifierForm.value,
          classId: Number(this.modifierForm.value.classId),
          id: this.selectedId,
        };
      }

      this.cancelEdit();
    }
  }

  deleteStudent(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This student will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.students = this.students.filter((s) => s.id !== id);

        Swal.fire({
          title: 'Deleted!',
          text: 'Student has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  cancelEdit() {
    this.modifierForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }
}
