import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  // Signal Inputs
  control     = input.required<FormControl>();
  label       = input<string>('');
  placeholder = input<string>('');
  type        = input<'text' | 'email' | 'password' | 'number'>('text');
  id          = input<string>(`input-${Math.random().toString(36).slice(2, 9)}`);
  hint        = input<string>('');

  // Internal State สำหรับจัดการการแสดงรหัสผ่าน
  showPassword = signal(false);

  // Computed: คำนวณหาประเภทของ Input ปัจจุบัน
  inputType = computed(() => {
    if (this.type() !== 'password') return this.type();
    return this.showPassword() ? 'text' : 'password';
  });

  // Computed: จัดการ CSS Classes
  containerClasses = computed(() => ({
    'form-group': true,
    'form-group--error': this.control().invalid && this.control().touched,
    'form-group--disabled': this.control().disabled
  }));

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}