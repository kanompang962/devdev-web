import {Directive, inject, input,TemplateRef, ViewContainerRef, effect,} from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole }    from '../../core/auth/auth.model';

// Usage: *appHasRole="'ADMIN'"
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly auth = inject(AuthService);
  private readonly tmpl = inject(TemplateRef);
  private readonly vcr  = inject(ViewContainerRef);

  appHasRole = input.required<UserRole>();

  constructor() {
    effect(() => {
      this.vcr.clear();
      if (this.auth.hasRole(this.appHasRole())) {
        this.vcr.createEmbeddedView(this.tmpl);
      }
    });
  }
}