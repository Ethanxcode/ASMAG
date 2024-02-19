/* eslint-disable @typescript-eslint/no-explicit-any */
// selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from '~/interfaces/cart';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectProductsCart = createSelector(
  selectCartState,
  cartState => cartState.products || []
);

export const selectTotalProductsCart = createSelector(
  selectCartState,
  cartState => cartState.total || 0
);
