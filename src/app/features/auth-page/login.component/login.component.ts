import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { ButtonComponent } from "@shared/components/button.component/button.component";
import { InputComponent } from "@shared/components/input.component/input.component";

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb      = inject(FormBuilder);
  private readonly auth    = inject(AuthService);
  private readonly router  = inject(Router);
  private readonly route   = inject(ActivatedRoute);

  readonly loading      = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    email:      ['john@mail.com', [Validators.required, Validators.email]],
    password:   ['1', [Validators.required, Validators.minLength(1)]],
    rememberMe: [false],
  });

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password, rememberMe } = this.form.getRawValue();

    this.auth.login({ email: email!, password: password!, rememberMe: rememberMe! })
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
          this.router.navigateByUrl(returnUrl);
          console.log(returnUrl)
        },
        error: (err) => {
          this.errorMessage.set(err?.message ?? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
          this.loading.set(false);
        },
      });
  }
}