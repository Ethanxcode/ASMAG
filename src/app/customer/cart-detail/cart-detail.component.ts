import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { product } from '~/interfaces/cart';
import { selectProductsCart } from '../../ngrx/selectors/cart.selector';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '~/layouts/header/header.component';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { CartService } from '~/service/cart';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '~/service/auth';
import { RouterLink } from '@angular/router';
import { UserInterface } from '~/interfaces/user';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [
    InputNumberModule,
    TableModule,
    InputNumberModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    HeaderComponent,
    CurrencyPipe,
    TagModule,
    SkeletonModule,
    FormsModule,
    StepsModule,
    DividerModule,
    CheckboxModule,
    RouterLink
  ],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss'
})
export class CartDetailComponent implements OnInit {
  cartItems$!: Observable<product[]>;

  user: any = null;

  steps: MenuItem[] | undefined;

  checked: boolean = false;

  tax = 8;

  shipping = 20;

  cartTotalQuantity$!: Observable<number>;

  calculateSubtotal$!: Observable<number>;

  calculateTotal$!: Observable<number>;

  constructor(
    private store: Store,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.store.select(selectProductsCart);

    this.user = this.auth.getUserInfo();

    this.calculateSubtotal$ = this.cartItems$.pipe(
      map(cartItems => this.cartService.handleCalculateSubTotal(cartItems))
    );

    this.calculateTotal$ = this.cartItems$.pipe(
      map(cartItems =>
        this.cartService.handleCalculateTotal(
          cartItems,
          this.shipping,
          this.tax
        )
      )
    );

    this.cartTotalQuantity$ = this.cartItems$.pipe(
      map(cartItems => this.cartService.handleCalculateTotalProduct(cartItems))
    );

    this.steps = [
      {
        label: 'Cart',
        routerLink: '/cart'
      },
      {
        label: 'Checkout & Confirmation',
        11: '/checkout'
      }
    ];
  }

  handleChangeQuantityProduct(product: product, $event: number) {
    this.cartService.changeQuantity(product.id, $event);
  }

  handleDeleteProductInCart = (productId: string) => {
    this.cartService.deleteProductFromCart(productId);
    this.cartService.handleGetProductsFromLocal();
  };

  handleCaculateSubtotalProduct(product: product): number {
    return this.cartService.handleCaculateSubtotalProduct(product);
  }
}

