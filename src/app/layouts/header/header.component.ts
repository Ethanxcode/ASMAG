import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CarouselHeaderComponent } from '~/components/carousel-header/carousel-header.component';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart';
import { Observable } from 'rxjs';
import { selectTotalProductsCart } from '~/ngrx/selectors/cart.selector';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '~/service/auth';

import { ChipModule } from 'primeng/chip';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CarouselHeaderComponent,
    BadgeModule,
    ButtonModule,
    RouterLink,
    CommonModule,
    MenuModule,
    AvatarModule,
    AvatarGroupModule,
    ChipModule
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  menus: MenuItem[] | undefined;
  user: any = null;

  cartTotalQuantity!: number;
  cartTotalQuantity$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private store: Store,
    private auth: AuthService,
    private router: Router
  ) {}
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  ngOnInit(): void {
    this.cartTotalQuantity$ = this.store.select(selectTotalProductsCart);
    this.cartTotalQuantity$.subscribe(cartTotalQuantity => {
      if (cartTotalQuantity === 0) {
        this.cartService.handleGetTotalFromLocal();
      }
    });

    this.user = this.auth.getUserInfo();

    if (this.user === null) {
      this.auth.user$.subscribe(data => {
        this.user = data;
      });
    }

    if (this.user != null && this.user?.role === 'admin') {
      this.menus = [
        {
          label: 'Users',
          items: [
            {
              label: 'Settings',
              icon: 'pi pi-cog',
              command: () => {
                this.router.navigate(['/profile']);
              }
            },
            {
              label: 'Sign out',
              icon: 'pi pi-sign-out',
              command: () => {
                this.auth.logout();
              }
            }
          ]
        },
        {
          label: 'Admin',
          items: [
            {
              label: 'Settings',
              icon: 'pi pi-cog',
              command: () => {
                this.router.navigate(['/admin']);
              }
            }
          ]
        }
      ];
    } else if (this.user != null) {
      this.menus = [
        {
          label: 'User',
          items: [
            {
              label: 'Settings',
              icon: 'pi pi-cog',
              command: () => {
                this.router.navigate(['/profile']);
              }
            },
            {
              label: 'Sign out',
              icon: 'pi pi-sign-out',
              command: () => {
                this.auth.logout();
              }
            }
          ]
        }
      ];
    } else {
      this.menus = [
        {
          label: 'Sign in & Sign up',
          items: [
            {
              label: 'Sign in',
              icon: 'pi pi-sign-in',
              routerLink: ['/signin']
            },
            {
              label: 'Sign up',
              icon: 'pi pi-user-plus',
              routerLink: ['/signup']
            }
          ]
        }
      ];
    }
  }

  logout() {
    this.auth.logout();
    this.user = null;
  }
}

