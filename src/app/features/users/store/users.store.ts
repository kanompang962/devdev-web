import { inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { computed } from '@angular/core';
import { pipe, switchMap, debounceTime, distinctUntilChanged } from 'rxjs';
import { UsersService, UsersQuery } from '../users.service';
import { User, UserStatus } from '../user.model';

interface UsersState {
  users:        User[];
  selectedUser: User | null;
  total:        number;
  page:         number;
  limit:        number;
  search:       string;
  loading:      boolean;
  saving:       boolean;
  error:        string | null;
}

const initialState: UsersState = {
  users:        [] as User[],
  selectedUser: null,
  total:        0,
  page:         1,
  limit:        20,
  search:       '',
  loading:      false,
  saving:       false,
  error:        null,
};

export const UsersStore = signalStore(
    withState(initialState),

    withComputed(({ users, total, page, limit }) => ({
        totalPages:  () => Math.ceil((total() ?? 0) / (limit() ?? 20)),
        hasUsers:    () => (users() ?? []).length > 0,
        activeUsers: () => (users() ?? []).filter((u) => u.status === 'ACTIVE').length,
        isEmpty:     () => (users() ?? []).length === 0,
    })),

    withMethods((store, service = inject(UsersService)) => {
        
        const fetchUsers = (query: UsersQuery) => {
        patchState(store, { loading: true, error: null });
        return service.getUsers(query).pipe(
            tapResponse({
            next: ({ data, total }) =>
                patchState(store, {
                users:   data,
                total,
                page:    query.page   ?? 1,
                search:  query.search ?? '',
                loading: false,
                }),
            error: (err: { message: string }) =>
                patchState(store, { error: err.message, loading: false }),
            }),
        );
        };

        const loadUsers = rxMethod<UsersQuery>(
        pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((query) => fetchUsers(query)),
        ),
        );

        return {
        loadUsers,

        setPage(page: number): void {
            loadUsers({ page, limit: store.limit(), search: store.search() });
        },

        setSearch(search: string): void {
            loadUsers({ page: 1, limit: store.limit(), search });
        },

        selectUser(user: User | null): void {
            patchState(store, { selectedUser: user });
        },

        updateStatusLocally(id: string, status: UserStatus): void {
            const users = store.users().map((u) =>
            u.id === id ? { ...u, status } : u,
            );
            patchState(store, { users });
        },

        removeLocally(id: string): void {
            patchState(store, {
            users:  store.users().filter((u) => u.id !== id),
            total:  store.total() - 1,
            });
        },
        };
    }),
);