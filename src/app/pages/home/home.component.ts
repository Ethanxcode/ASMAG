import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { CardProductComponent } from '~/components/card-product/card-product.component';
import { HttpMethodService } from '~/service/service';
import { MenubarModule } from 'primeng/menubar';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { FilterService } from '~/service/filter';
import { PaginatorModule } from 'primeng/paginator';
import { combineLatest } from 'rxjs';
import { Product } from '~/interfaces/product';
import { NavbarMenuComponent } from '~/navbar-menu/navbar-menu.component';
import { CarouselHeaderComponent } from '~/components/carousel-header/carousel-header.component';
import { HeaderComponent } from '~/layouts/header/header.component';
import { FooterComponent } from '~/layouts/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardProductComponent,
    SkeletonModule,
    MenubarModule,
    FormsModule,
    DataViewModule,
    PaginatorModule,
    NavbarMenuComponent,
    CarouselHeaderComponent,
    HeaderComponent,
    FooterComponent
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products!: Product[];

  sortOptions!: SelectItem[];

  sortOrder!: number;

  sortField!: string;

  loaded: boolean = false;

  currentPage: number = 1;

  totalRecords: number = 10;

  itemsPerPage: number = 4;

  filteredProducts: Product[] = [];

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

  constructor(
    private httpMethodService: HttpMethodService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.httpMethodService
      .get('https://9z82v4-8080.csb.app/api/data')
      .subscribe((response: Product[]) => {
        this.products = response;
        if (response.length > 0) {
          setTimeout(() => {
            this.loaded = true;
            this.filteredProducts = this.products.slice(
              (this.currentPage - 1) * this.itemsPerPage,
              this.currentPage * this.itemsPerPage
            );
          }, 1500);

          this.totalRecords = this.products.length;
        }

        combineLatest([
          this.filterService.getDebouncedFilterTerm(),
          this.filterService.currentPage$,
          this.filterService.itemsPerPage$,
          this.filterService.category$
        ]).subscribe(([term, page, itemsPerPage, category]) => {
          this.updateFilteredProducts(term, page, itemsPerPage, category);
        });
      });
  }

  onPageChange(event: any) {
    this.filterService.changePage(event.page + 1);
    this.filterService.changeItemsPerPage(event.rows);
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}

