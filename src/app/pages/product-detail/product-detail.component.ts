import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpMethodService } from '../../service/service';
import { Product } from '~/interfaces/product';
import { HeaderComponent } from '~/layouts/header/header.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GalleriaModule } from 'primeng/galleria';
import { product } from '~/interfaces/cart';
import { RatingModule } from 'primeng/rating';
import { CartService } from '~/service/cart';
import { Toast } from '../../service/toast';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    ButtonModule,
    BreadcrumbModule,
    HeaderComponent,
    CurrencyPipe,
    RippleModule,
    TagModule,
    SkeletonModule,
    GalleriaModule,
    CascadeSelectModule,
    DropdownModule,
    FormsModule,
    RadioButtonModule,
    RatingModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  breadcrumb: MenuItem[] | undefined;

  loaded: boolean = false;

  home: MenuItem | undefined;

  colors!: string;

  sizes!: any[];

  selectedSize!: { label: number; quantity: number };

  images!: Array<{ image: string }>;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private httpMethodService: HttpMethodService,
    private cartService: CartService,
    private toast: Toast
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      setTimeout(() => {
        this.loaded = true;
      }, 1500);
      this.httpMethodService
        .get(`https://9z82v4-8080.csb.app/api/data/${id}`)
        .subscribe((response: Product) => {
          this.product = response;

          this.breadcrumb = [
            { label: this.product.category.toUpperCase() },
            { label: this.product.brand.name.toUpperCase() },
            { label: this.product.name.toUpperCase() }
          ];

          this.home = { icon: 'pi pi-home', routerLink: '/' };

          this.colors = this.product.colorway;

          this.sizes = this.product.sizes;

          this.images = this.product.image.map(imgUrl => ({ image: imgUrl }));
        });
    }
  }

  getSeverity(quantity: number) {
    if (quantity <= 0) {
      return { severity: 'danger', label: 'OUTOFSTOCK' };
    } else if (quantity <= 10) {
      return { severity: 'warning', label: 'LOWSTOCK' };
    } else {
      return { severity: 'success', label: 'INSTOCK' };
    }
  }

  onSelectedSize = (size: { label: number; quantity: number }) => {
    this.selectedSize = size;
  };

  handleAddToCart(product: Product): void {
    if (this.selectedSize === undefined) {
      this.toast.showError('Please select size');
      return;
    }
    const cartProduct: product = {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image[0],
      colorway: product.colorway,
      sizes: {
        size: this.selectedSize.label,
        quantity: this.selectedSize.quantity
      },
      category: product.category,
      brand: product.brand
    };
    this.cartService.addToCart(cartProduct);
    this.cartService.handleGetProductsFromLocal();
    this.toast.showSuccess('Add to cart success');
    return;
  }
}

