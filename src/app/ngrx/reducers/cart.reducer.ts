// cart.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { CartState } from '~/interfaces/cart';
import { getDataFromLocalStorage } from '../action/cart.action';

export const initialState: CartState = { products: [], total: 0 };

export const cartReducer = createReducer(
  initialState,

  on(
    getDataFromLocalStorage,
    (state: CartState, { products, total }): CartState => {
      return {
        ...state,
        products: products,
        total: total
      };
    }
  )
);
