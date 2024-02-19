import { MainCategory, Order, Subcategory } from './../../interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { GalleriaModule } from 'primeng/galleria';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ApiResponseItem, Product } from '~/interfaces/product';
import { HeaderComponent } from '~/layouts/header/header.component';
import { CartService } from '~/service/cart';
import { HttpMethodService } from '~/service/service';
import { Toast } from '~/service/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { BadgeModule } from 'primeng/badge';
import { Table, TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { DataViewModule } from 'primeng/dataview';
import { ChartModule } from 'primeng/chart';
import { PaginatorModule } from 'primeng/paginator';

import { combineLatest } from 'rxjs';
import { FilterService } from '../../service/filter';
import { Category, OrderItem } from '../../interfaces/product';
import { AuthService } from '~/service/auth';

@Component({
  selector: 'app-admin-dashboard',
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
    FormsModule,
    RadioButtonModule,
    RatingModule,
    TabMenuModule,
    BadgeModule,
    TableModule,
    MenuModule,
    DataViewModule,
    ChartModule,
    PaginatorModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  products!: Product[];

  orderDetail!: any;

  orders!: any[];

  inputValue: string = '';

  statuses!: SelectItem[];

  Category!: SelectItem[];

  clonedProducts: { [s: string]: Product } = {};

  breadcrumb: MenuItem[] | undefined;

  loaded: boolean = false;

  home: MenuItem | undefined;

  colors!: string;

  sizes!: any[];

  selectedSize!: { label: number; quantity: number };

  images!: Array<{ image: string }>;

  filteredProducts: Product[] = [];

  chartData: any;

  chartOptions: any;

  smallMenu: MenuItem[] | undefined;

  ordersOverview!: number;
  productsOverview!: number;
  usersOverview!: number;

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
    private http: HttpMethodService,
    private cartService: CartService,
    private toast: Toast,
    private auth: AuthService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.handleGetProducts();
    this.handleGetOrders();
    this.handleGetOverviewDashboard();
    this.handleGetUsersAndOrdersPerMonth();
    this.handleGetCategory();

    this.loaded = true;

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.breadcrumb = [{ label: 'Admin' }, { label: 'Settings' }];

    this.smallMenu = [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        command: () => {}
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: () => {}
      }
    ];

    this.statuses = [
      { label: 'Pending', value: 'PENDING' },
      { label: 'Cancel', value: 'CANCEL' },
      { label: 'Approved', value: 'APPROVED' }
    ];
  }

  convertApiResponseToChartData = (ApiResponse: ApiResponseItem[]) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const monthLabels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const usersData = ApiResponse.map(item => item.userCount || 0);
    const ordersData = ApiResponse.map(item => item.orderCount || 0);

    this.chartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'User Count',
          data: usersData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'), // Your desired color
          tension: 0.4
        },
        {
          label: 'Order Count',
          data: ordersData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'), // Your desired color
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  };

  handleGetUsersAndOrdersPerMonth() {
    this.http
      .get('https://9z82v4-8080.csb.app/api/count-per-month')
      .subscribe((response: ApiResponseItem[]) => {
        this.convertApiResponseToChartData(response);
      });
  }

  handleGetCategory() {
    this.http
      .get('https://9z82v4-8080.csb.app/api/categories')
      .subscribe((response: MainCategory[]) => {
        this.Category = response.reduce(
          (flattenedOptions, mainCategory) => {
            const mainCategoryOption = {
              label: mainCategory.name,
              value: mainCategory.id
            };

            const subcategories = mainCategory.group.reduce(
              (subCategoryOptions, subCategory) => {
                const narrowCategoryOptions = subCategory.narrowCategory.map(
                  narrowCategory => ({
                    label: narrowCategory.narrowCategoryName,
                    value: narrowCategory.narrowCategoryName
                  })
                );

                return subCategoryOptions.concat(narrowCategoryOptions);
              },
              [] as { label: string; value: string }[]
            );

            return flattenedOptions.concat([
              mainCategoryOption,
              ...subcategories
            ]);
          },
          [] as { label: string; value: string }[]
        );
      });
  }

  handleGetOverviewDashboard(): void {
    this.http
      .get('https://9z82v4-8080.csb.app/admin-dashboard-overview')
      .subscribe((response: any) => {
        this.ordersOverview = response.data.orders;
        this.productsOverview = response.data.products;
        this.usersOverview = response.data.users;
      });
  }

  handleGetProducts(): void {
    this.http
      .get('https://9z82v4-8080.csb.app/api/data')
      .subscribe((response: Product[]) => {
        this.products = response;
      });
  }

  handleGetOrders(): void {
    this.http
      .get('https://9z82v4-8080.csb.app/api/orders')
      .subscribe((response: any) => {
        this.orders = response;
      });
  }

  handleGetOrderDetail(id: string): void {
    this.http
      .get(`https://9z82v4-8080.csb.app/api/orders/${id}?_embe=data`)
      .subscribe((response: any[]) => {
        this.orderDetail = response;
        console.log(this.orderDetail);
      });
  }

  onPageChange(event: any) {
    this.filterService.changePage(event.page + 1);
    this.filterService.changeItemsPerPage(event.rows);
  }

  updateFilteredProducts(
    term: string,
    page: number,
    itemsPerPage: number,
    category: string
  ) {
    const filtered = this.products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    this.filteredProducts =
      category !== ''
        ? filtered.filter(
            product =>
              product.brand.narrowCategoryId.toLowerCase().trim() ===
              category.trim()
          )
        : filtered;
    console.log(category);
    this.filteredProducts = this.filteredProducts.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }

  getOrderSeverity(status: string) {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCEL':
        return 'danger';
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

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(product: Product) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id as string];
      this.auth.updateProductField(product, product.id);
    } else {
      this.toast.showError('Invalid Price');
    }
  }

  deleteSelectedProducts(product: Product) {
    if (product) {
      this.auth.deleteProduct(product.id);
    } else {
      this.toast.showError('Invalid Product');
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.products[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
  }

  clear(table: Table) {
    table.clear();
  }
}

