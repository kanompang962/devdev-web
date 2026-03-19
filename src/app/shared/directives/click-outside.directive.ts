import {
  Directive, ElementRef, inject,
  output, HostListener,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  private readonly el = inject(ElementRef);

  clickOutside = output<void>();

  @HostListener('document:click', ['$event'])
   onClick(event: Event): void {
    const target = event.target as Node | null;
    if (target && !this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}