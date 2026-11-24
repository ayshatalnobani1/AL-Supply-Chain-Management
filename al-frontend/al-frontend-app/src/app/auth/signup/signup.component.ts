import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // update path if needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
  username: ['', Validators.required],
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required],
  number: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  role: ['', Validators.required],
  companyType: [''] // optional
});
  }

 onSubmit(): void {
  if (this.signupForm.valid) {
    const formData = { ...this.signupForm.value };
    delete formData.confirmPassword; // remove confirmPassword before sending

    this.authService.signup(formData).subscribe({
      next: () => {
        alert('Account created successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Signup failed. Check console.');
        console.error(err);
      },
    });
  }
}
}
