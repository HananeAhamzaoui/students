import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import Swal from 'sweetalert2';

interface Subject {
  id: number;
  name: string;
  description: string;
  semester: number;
}

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [NgFor, NgIcon, NgIf, ReactiveFormsModule, HttpClientModule],
  providers: [
    provideIcons({
      heroPencilSquare,
      heroTrash,
    }),
  ],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.css',
})
export class SubjectComponent {
  subjects: Subject[] = [
    { id: 1, name: 'Math', description: 'Algebra & Geometry', semester: 1 },
    { id: 2, name: 'Physics', description: 'Mechanics', semester: 2 },
  ];

  isAdding = false;
  isEditing = false;
  selectedId: number | null = null;

  addForm: FormGroup;
  modifierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      semester: [
        '',
        [Validators.required, Validators.min(1), Validators.max(3)],
      ],
    });

    this.modifierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      semester: [
        '',
        [Validators.required, Validators.min(1), Validators.max(3)],
      ],
    });
  }

  isInvalid(form: FormGroup, control: string): boolean {
    const c = form.get(control);
    return !!(c && c.invalid && c.touched);
  }

  /* ================= ADD ================= */
  addSubject() {
    if (!this.isAdding) {
      this.addForm.reset();
      this.isAdding = true;
      return;
    }

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const newSubject: Subject = {
      id: Math.max(...this.subjects.map((s) => s.id)) + 1,
      ...this.addForm.value,
    };

    this.subjects.push(newSubject);

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'Subject added successfully',
      timer: 1500,
      showConfirmButton: false,
    });

    this.cancelAdd();
  }

  cancelAdd() {
    this.addForm.reset();
    this.isAdding = false;
  }

  /* ================= EDIT ================= */
  editSubject(subject?: Subject) {
    if (subject) {
      this.selectedId = subject.id;
      this.isEditing = true;
      this.modifierForm.patchValue(subject);
      return;
    }

    if (this.modifierForm.valid && this.selectedId !== null) {
      const index = this.subjects.findIndex((s) => s.id === this.selectedId);

      if (index !== -1) {
        this.subjects[index] = {
          ...this.modifierForm.value,
          id: this.selectedId,
        };
      }

      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.modifierForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }

  /* ================= DELETE ================= */
  deleteSubject(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This subject will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjects = this.subjects.filter((s) => s.id !== id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  }
}
