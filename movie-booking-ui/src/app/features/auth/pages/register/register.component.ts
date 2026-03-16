import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule   // ✅ RouterLink REMOVED
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        contactNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{10}$')]
        ]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // 🔹 Getter for template
  get f() {
    return this.registerForm.controls;
  }

  // 🔹 Password match validator
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (res: string) => {
        this.loading = false;
        this.success = res || 'Registration successful';

        // ✅ Redirect to login
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error || 'Registration failed';
      }
    });
  }
}
