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

import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { CartService } from '~/service/cart';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '~/service/auth';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-checkout',
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
    RadioButtonModule
  ],
  templateUrl: './cart-checkout.component.html',
  styleUrl: './cart-checkout.component.scss'
})
export class CartCheckoutComponent implements OnInit {
  cartItems$!: Observable<product[]>;

  user: any = null;

  steps: MenuItem[] | undefined;

  checked: boolean = false;

  tax = 8;

  shipping = 20;

  cartTotalQuantity$!: Observable<number>;

  calculateSubtotal$!: Observable<number>;

  calculateTotal$!: Observable<number>;

  selectedPayments: any = null;

  payments: any[] = [
    { name: 'Thanh toán tiền mặt khi nhận hàng', key: 'cash' },
    { name: 'Thanh toán bằng ví Viettel Money', key: 'viettelMoney' },
    { name: 'Thanh toán bằng ví MoMo', key: 'momo' },
    { name: 'Thanh toán bằng ví ZaloPay', key: 'zaloPay' },
    { name: 'Thanh toán bằng VNPAY', key: 'vnpay' },
    { name: 'Thanh toán bằng thẻ quốc tế Visa, Master, JCB', key: 'card' }
  ];

  constructor(
    private store: Store,
    private cartService: CartService,
    private auth: AuthService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.store.select(selectProductsCart);

    this.selectedPayments = this.payments[0];

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
        routerLink: '/checkout'
      }
    ];
  }

  handleCaculateSubtotalProduct(product: product): number {
    return this.cartService.handleCaculateSubtotalProduct(product);
  }

  handleDeleteProductInCart = (productId: string) => {
    this.cartService.deleteProductFromCart(productId);
    this.cartService.handleGetProductsFromLocal();
  };

  handleSubmitOrder = () => {
    // Subscribe to the observables to get their values
    this.cartItems$.subscribe(cartItems => {
      const form = {
        orderItems: cartItems.map(item => ({
          dataId: item.id,
          quantity: item.quantity
        })),
        total: 0, // You need to replace this with the actual value
        totalQuantity: 0, // You need to replace this with the actual value
        shipping: this.shipping,
        tax: this.tax,
        payment: this.selectedPayments,
        user: this.user.id,
        address: this.user.address
      };

      // Subscribe to calculateTotal$ observable to get its value
      this.calculateTotal$.subscribe(total => {
        form.total = total;
      });

      // Subscribe to cartTotalQuantity$ observable to get its value
      this.cartTotalQuantity$.subscribe(totalQuantity => {
        form.totalQuantity = totalQuantity;
      });

      // Now you can use the form object for further processing or API calls
      this.cart.handleCreateNowOrder(form);
    });
  };
}

