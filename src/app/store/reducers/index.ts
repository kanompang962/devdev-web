import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { isDevMode } from '@angular/core';

export interface AppState {
  // feature states จะเพิ่มที่นี่ทีหลัง
  // เช่น auth: AuthState
}

export const reducers: ActionReducerMap<AppState> = {};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];