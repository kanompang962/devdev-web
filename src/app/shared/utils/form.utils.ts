import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function thaiPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    const valid = /^(0[689]\d{8}|0[2-9]\d{7})$/.test(value);
    return valid ? null : { invalidThaiPhone: true };
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    const checks = {
      hasUpper:   /[A-Z]/.test(value),
      hasLower:   /[a-z]/.test(value),
      hasNumber:  /\d/.test(value),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{}]/.test(value),
      isLong:     value.length >= 8,
    };
    const passed = Object.values(checks).every(Boolean);
    return passed ? null : { weakPassword: checks };
  };
}

export function matchFieldValidator(targetField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const target = control.parent?.get(targetField);
    if (!target) return null;
    return target.value === control.value ? null : { fieldMismatch: true };
  };
}

export function getErrorMessage(control: AbstractControl): string {
  if (control.hasError('required'))        return 'กรุณากรอกข้อมูล';
  if (control.hasError('email'))           return 'รูปแบบอีเมลไม่ถูกต้อง';
  if (control.hasError('minlength'))       return `ต้องมีอย่างน้อย ${control.errors!['minlength'].requiredLength} ตัวอักษร`;
  if (control.hasError('maxlength'))       return `ต้องไม่เกิน ${control.errors!['maxlength'].requiredLength} ตัวอักษร`;
  if (control.hasError('invalidThaiPhone')) return 'รูปแบบเบอร์โทรไม่ถูกต้อง';
  if (control.hasError('weakPassword'))    return 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่ เล็ก ตัวเลข และอักขระพิเศษ';
  if (control.hasError('fieldMismatch'))   return 'ข้อมูลไม่ตรงกัน';
  return 'ข้อมูลไม่ถูกต้อง';
}