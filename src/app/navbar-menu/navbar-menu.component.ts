import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MegaMenuModule } from 'primeng/megamenu';
import { MegaMenuItem } from 'primeng/api';
import { FilterService } from '~/service/filter';
import { HttpMethodService } from '../service/service';
import { Category } from '~/interfaces/product';

@Component({
  selector: 'app-navbar-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    MegaMenuModule
  ],
  templateUrl: './navbar-menu.component.html',
  styleUrl: './navbar-menu.component.scss'
})
export class NavbarMenuComponent implements OnInit, AfterViewInit {
  megaMenuItems: MegaMenuItem[] = [];

  term: string = '';

  categories: Category[] = [];

  constructor(
    private httpMethodService: HttpMethodService,
    private filterService: FilterService
  ) {}

  onFilterTermChange(term: string) {
    this.filterService.changeFilterTerm(term);
  }
  onFilterCategoryChange(term: string) {
    this.filterService.changeCategory(term);
  }

  ngOnInit(): void {
    this.httpMethodService
      .get('https://9z82v4-8080.csb.app/api/categories')
      .subscribe((response: Category[]) => {
        this.categories = response;
        this.megaMenuItems = this.categories.map(category =>
          this.createMenuItem(
            category.name.toUpperCase(),
            'pi pi-fw pi-tag',
            category.group.map(subCategory =>
              this.createSubMenuItem(
                subCategory.narrowCategoryName,
                subCategory.narrowCategory
              )
            )
          )
        );
      });
  }

  ngAfterViewInit(): void {}

  createMenuItem(label: string, icon: string, items: any[]): any {
    return {
      label: label,
      icon: icon,
      items: [items]
    };
  }

  createSubMenuItem(label: string, items: any[]): any {
    return {
      label: label.toUpperCase(),
      items: items.map(item => ({
        label: item.narrowCategoryName,
        command: () => this.onFilterCategoryChange(item.narrowCategoryId)
      }))
    };
  }
}

