import {Directive, inject, input,TemplateRef, ViewContainerRef, effect,} from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Permission }  from '../../core/auth/auth.model';

// Usage: *appHasPermission="'users:write'"
@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly auth = inject(AuthService);
  private readonly tmpl = inject(TemplateRef);
  private readonly vcr  = inject(ViewContainerRef);

  appHasPermission = input.required<Permission>();

  constructor() {
    effect(() => {
      this.vcr.clear();
      if (this.auth.hasPermission(this.appHasPermission())) {
        this.vcr.createEmbeddedView(this.tmpl);
      }
    });
  }
}