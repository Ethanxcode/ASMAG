import { product } from './../../interfaces/cart';
// cart.actions.ts
import { createAction, props } from '@ngrx/store';

export const getDataFromLocalStorage = createAction(
  '[Cart] Get Data From Local Storage',
  props<{ products: product[]; total: number }>()
);
