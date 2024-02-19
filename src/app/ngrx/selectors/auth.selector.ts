/* eslint-disable @typescript-eslint/no-explicit-any */
// selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '~/interfaces/user';

export const selectUserState =
  createFeatureSelector<UserState>('authentication');

export const selectAuthentication = createSelector(
  selectUserState,
  UserState => UserState.user || []
);
