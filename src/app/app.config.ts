import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/auth/jwt.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore }        from '@ngrx/store';
import { provideEffects }      from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { metaReducers, reducers } from '@store/reducers';
import { AppEffects } from '@store/effects/app.effects';
import {
  LucideAngularModule,
  LayoutDashboard, Database, Settings,
  Users, BarChart2, FileText, Home, ShieldPlus,
  ScrollText, Lock, Circle, LayoutGrid, UserCog
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),  // bind route :id → @Input() id
      withViewTransitions(),        // native page transitions
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor, errorInterceptor]),
    ),
    provideAnimationsAsync(),
    provideStore(reducers, { metaReducers }),
    provideEffects([AppEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), autoPause: true }),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard, Database, Settings,
        Users, BarChart2, FileText, ShieldPlus,
        Home, ScrollText, Lock, Circle, LayoutGrid, UserCog
      }),
    ),
  ]
};
