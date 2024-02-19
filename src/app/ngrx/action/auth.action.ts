import { UserInterface } from './../../interfaces/user';
// cart.actions.ts
import { createAction, props } from '@ngrx/store';

export const getAuthentication = createAction(
  '[Authentication] Get Data From Local Storage',
  props<{ user: UserInterface }>()
);
