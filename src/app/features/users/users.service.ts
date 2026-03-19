import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto, UserStatus } from './user.model';
import { environment } from '@env/environment';
import { PagedResult } from '@core/http/api.service';

export interface UsersQuery {
  page?:   number;
  limit?:  number;
  search?: string;
  role?:   string;
  status?: UserStatus;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly api  = `${environment.apiUrl}/users`;

  getUsers(query?: UsersQuery): Observable<PagedResult<User>> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          params = params.set(k, String(v));
        }
      });
    }
    return this.http.get<PagedResult<User>>(this.api, { params });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.api, dto);
  }

  updateUser(id: string, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.api}/${id}`, dto);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  toggleStatus(id: string, status: UserStatus): Observable<User> {
    return this.http.patch<User>(`${this.api}/${id}/status`, { status });
  }
}