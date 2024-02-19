// cart.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { getAuthentication } from '../action/auth.action';
import { UserState } from '~/interfaces/user';

export const initialState: UserState = {
  user: null,
  accessToken: ''
};

export const cartReducer = createReducer(
  initialState,

  on(getAuthentication, (state: UserState, { user }): UserState => {
    return {
      ...state,
      user: user,
      accessToken: user.token
    };
  })
);
