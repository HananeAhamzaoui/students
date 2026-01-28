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
import Swal from 'sweetalert2';

interface SchoolClass {
  id: number;
  nom: string;
  level: string;
  annee: number;
}

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, NgIcon],
  providers: [
    provideIcons({
      heroPencilSquare,
      heroTrash,
    }),
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.css',
})
export class ClassComponent {
  classes: SchoolClass[] = [
    { id: 1, nom: 'A', level: '1st Year', annee: 2024 },
    { id: 2, nom: 'B', level: '2nd Year', annee: 2024 },
    { id: 3, nom: 'C', level: '3rd Year', annee: 2024 },
  ];

  isAdding = false;
  isEditing = false;
  selectedId: number | null = null;

  addForm: FormGroup;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addForm = this.fb.group({
      nom: ['', Validators.required],
      level: ['', Validators.required],
      annee: [
        '',
        [
          Validators.required,
          Validators.min(2000),
          Validators.max(new Date().getFullYear() + 1),
        ],
      ],
    });

    this.editForm = this.fb.group({
      nom: ['', Validators.required],
      level: ['', Validators.required],
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

  isInvalid(form: FormGroup, control: string): boolean {
    const c = form.get(control);
    return !!(c && c.invalid && c.touched);
  }

  /* ================= ADD ================= */
  addClass() {
    if (!this.isAdding) {
      this.addForm.reset();
      this.isAdding = true;
      return;
    }

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const newClass: SchoolClass = {
      id: Math.max(...this.classes.map(c => c.id)) + 1,
      ...this.addForm.value,
      annee: Number(this.addForm.value.annee),
    };

    this.classes.push(newClass);

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'Class added successfully',
      timer: 1500,
      showConfirmButton: false,
    });

    this.cancelAdd();
  }

  cancelAdd() {
    this.isAdding = false;
    this.addForm.reset();
  }

  /* ================= EDIT ================= */
  editClass(c?: SchoolClass) {
    if (c) {
      this.selectedId = c.id;
      this.isEditing = true;
      this.editForm.patchValue(c);
      return;
    }

    if (this.editForm.valid && this.selectedId !== null) {
      const index = this.classes.findIndex(cl => cl.id === this.selectedId);

      if (index !== -1) {
        this.classes[index] = {
          id: this.selectedId,
          ...this.editForm.value,
          annee: Number(this.editForm.value.annee),
        };
      }

      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedId = null;
    this.editForm.reset();
  }

  /* ================= DELETE ================= */
  deleteClass(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This class will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.classes = this.classes.filter(c => c.id !== id);

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
