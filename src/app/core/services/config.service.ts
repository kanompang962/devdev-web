import { Injectable, signal, computed } from '@angular/core';
import { environment } from '@env/environment';

type FeatureFlagKey = keyof typeof environment.featureFlags;

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly _flags = signal({ ...environment.featureFlags });

  readonly flags        = this._flags.asReadonly();
  readonly isProduction = computed(() => environment.production);
  readonly version      = computed(() => environment.appVersion);
  readonly apiUrl       = computed(() => environment.apiUrl);

  isEnabled(flag: FeatureFlagKey): boolean {
    return this._flags()[flag] ?? false;
  }

  // Remote config: override flags at runtime
  setFlags(updates: Partial<typeof environment.featureFlags>): void {
    this._flags.update((f) => ({ ...f, ...updates }));
  }
}