import { Injectable } from '@angular/core';
import { product } from '../interfaces/cart';
import { getDataFromLocalStorage } from '~/ngrx/action/cart.action';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://9z82v4-8080.csb.app/auth';

  public cartItems: product[] = [];

  public total: number = 0;

  constructor(
    private store: Store,
    private basicHttp: HttpClient,
    private router: Router,
    private toast: Toast
  ) {
    this.loadCart();
  }

  getCartItems(): product[] {
    return this.cartItems;
  }

  getTotalCartItems(): number {
    return this.total;
  }

  addToCart(product: product): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
      this.total += 1;
    }

    this.updateLocalStorage();
  }

  deleteProductFromCart(prd_id: string) {
    console.log(prd_id);
    const newCart = this.cartItems.filter(item => item.id !== prd_id);
    this.cartItems = newCart;

    this.updateLocalStorage();
  }

  private loadCart(): void {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartItems = storedCart;
  }

  private updateLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  handleGetProductsFromLocal = () => {
    const products = localStorage.getItem('cart');
    const parsedProducts = products ? JSON.parse(products) : [];
    const total = parsedProducts.length;
    this.store.dispatch(
      getDataFromLocalStorage({ products: parsedProducts, total: total })
    );
  };

  handleUpdateProductsFromLocal = () => {
    const products = localStorage.getItem('cart');
    const parsedProducts = products ? JSON.parse(products) : [];
    const total = parsedProducts.length;
    this.store.dispatch(
      getDataFromLocalStorage({ products: parsedProducts, total: total })
    );
  };

  handleGetTotalFromLocal = () => {
    const total = this.handleGetProductsFromLocal();
    return total;
  };

  changeQuantity(productId: string, newQuantity: number): void {
    const productIndex = this.cartItems.findIndex(
      product => product.id === productId
    );

    if (productIndex !== -1 && this.cartItems[productIndex].quantity !== 0) {
      const product = this.cartItems[productIndex];
      const updatedProduct = { ...product, quantity: newQuantity };

      this.cartItems[productIndex] = updatedProduct;
    } else {
      this.deleteProductFromCart(productId);
    }

    this.updateLocalStorage();
    this.handleGetProductsFromLocal();
  }

  handleCaculateSubtotalProduct(product: product): number {
    return product.price * product.quantity;
  }

  handleCalculateSubTotal(cartItems: product[]): number {
    let total = 0;
    for (const item of cartItems) {
      total += this.handleCaculateSubtotalProduct(item);
    }

    return total;
  }

  handleCalculateTotalProduct(cartItems: product[]): number {
    let total = 0;
    for (const item of cartItems) {
      total += item.quantity;
    }

    return total;
  }

  handleCalculateTotal(
    cartItems: product[],
    shipping: number,
    vatTax: number
  ): number {
    if (cartItems.length === 0) {
      return 0;
    }

    let total = 0;
    for (const item of cartItems) {
      total += this.handleCaculateSubtotalProduct(item);
    }

    if (shipping) {
      total += shipping;
    }

    if (vatTax) {
      total += (total + vatTax) / 100;
    }
    return total;
  }

  handleCreateNowOrder(form: Record<string, any>): void {
    try {
      const headers = new HttpHeaders({
        authorization: 'Bearer ' + localStorage.getItem('access_token')
      });
      this.basicHttp
        .post(`${this.apiUrl}/create-new-order`, form, { headers })
        .subscribe(
          (response: any) => {
            // Replace 'any' with the appropriate type for the response
            if (response && response.status === 201) {
              this.toast.showSuccess(response.message);
              setTimeout(() => {
                this.cartItems = [];
                this.updateLocalStorage();
                this.router.navigate(['/']);
                this.store.dispatch(
                  getDataFromLocalStorage({ products: [], total: 0 })
                );
              }, 500);
            }
          },
          (error: any) => {
            // Handle HTTP error
            if (error && error.error && error.error.message) {
              this.toast.showError(error.error.message);
            } else {
              this.toast.showError('An error occurred');
            }
          }
        );
    } catch (error: any) {
      // Handle unexpected errors during the try block
      this.toast.showError(error.message);
    }
  }
}
