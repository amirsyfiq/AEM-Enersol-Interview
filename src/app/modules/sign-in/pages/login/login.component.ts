import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignInService } from '../../services/sign-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  errorMessage: string | null = null;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private signInService: SignInService,
    private router: Router
  ) { }

  ngOnInit() { }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = {
      username: this.loginForm.value.username as string,
      password: this.loginForm.value.password as string,
    };

    this.isLoading = true;
    this.signInService.login(payload).subscribe({
      next: (response) => {
        localStorage.setItem('token', response);
        this.loginForm.reset();
        this.isSubmitted = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid Username or Password';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }
}