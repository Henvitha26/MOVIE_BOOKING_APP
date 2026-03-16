import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // 🔹 Getter for template
  get f() {
    return this.form.controls;
  }

  // 🔹 Validator
  passwordMatchValidator(control: AbstractControl) {
    const p = control.get('newPassword')?.value;
    const c = control.get('confirmPassword')?.value;
    return p === c ? null : { mismatch: true };
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const username: string = this.form.value.username;
    const newPassword: string = this.form.value.newPassword;

    this.loading = true;

    this.authService.forgotPassword(username, newPassword).subscribe({
      next: (res: string) => {
        this.loading = false;
        this.success = res || 'Password updated successfully';
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error || 'Password reset failed';
      }
    });
  }
}
