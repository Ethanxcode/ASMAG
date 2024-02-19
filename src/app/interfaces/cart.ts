import { Brand } from './product';

export interface product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: Brand;
  colorway: string;
  sizes: size;
  category: string;
  image: string;
}

export interface size {
  size: number;
  quantity: number;
}

export interface CartState {
  products: product[];
  total: number;
}

export interface updateProductState {
  product: product;
}

export interface CartItem {
  products: product[];
}

export interface cartTotalState {
  total: number;
}
