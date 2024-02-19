import { HomeComponent } from '~/pages/home/home.component';
import { AboutUsComponent } from '~/pages/about-us/about-us.component';
import { ContactUsComponent } from '~/pages/contact-us/contact-us.component';
import { ShopComponent } from '~/pages/shop/shop.component';
import { ProductDetailComponent } from '~/pages/product-detail/product-detail.component';
import { PaymentComponent } from '~/pages/payment/payment.component';
import { PostsComponent } from '~/pages/posts/posts.component';
import { SigninSignupComponent } from '~/pages/signin-signup/signin-signup.component';
import { PageNotFoundComponent } from '~/pages/page-not-found/page-not-found.component';

import { CartDetailComponent } from '~/customer/cart-detail/cart-detail.component';
import { ProfileComponent } from '~/customer/profile/profile.component';
import { PurchaseHistoryComponent } from '~/customer/purchase-history/purchase-history.component';

import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ProductsCrudComponent } from './admin/products-crud/products-crud.component';
import { CartCheckoutComponent } from './pages/cart-checkout/cart-checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SigninSignupComponent },
  { path: 'signup', component: SigninSignupComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'cart', component: CartDetailComponent },
  { path: 'checkout', component: CartCheckoutComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin'
    }
  },
  {
    path: 'admin/new-product',
    component: ProductsCrudComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin'
    }
  },

  { path: 'purchase/:id', component: PurchaseHistoryComponent },
  { path: '**', component: PageNotFoundComponent }
];

