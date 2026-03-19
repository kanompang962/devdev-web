import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { User } from '../../user.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getErrorMessage } from '@shared/utils/form.utils';
import { UsersService } from '../../users.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from "@shared/components/spinner.component/spinner.component.js";

@Component({
  selector: 'app-user-form',
  imports: [SpinnerComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  id = input<string>();

  private readonly fb      = inject(FormBuilder);
  private readonly service = inject(UsersService);
  private readonly router  = inject(Router);

  readonly isEditMode = computed(() => !!this.id());
  readonly loading    = signal(false);
  readonly saving     = signal(false);
  readonly error      = signal<string | null>(null);

  readonly getError = getErrorMessage;

  readonly form = this.fb.group({
    firstName:  ['', [Validators.required, Validators.minLength(2)]],
    lastName:   ['', [Validators.required, Validators.minLength(2)]],
    email:      ['', [Validators.required, Validators.email]],
    role:       ['USER', Validators.required],
    department: [''],
    phone:      [''],
  });

  ngOnInit(): void {
    if (this.isEditMode()) {
      this.loading.set(true);
      this.service.getUserById(this.id()!).subscribe({
        next: (user) => {
          this.form.patchValue(user);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.message);
          this.loading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const value = this.form.getRawValue() as any;

    const request$ = this.isEditMode()
      ? this.service.updateUser(this.id()!, value)
      : this.service.createUser(value);

    request$.subscribe({
      next: (user: User) => this.router.navigate(['/users', user.id]),
      error: (e: { message: string }) => {
        this.error.set(e.message);
        this.saving.set(false);
      },
    });
  }

  f(name: string) {
    return this.form.get(name)!;
  }
}