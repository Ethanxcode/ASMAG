import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Brand } from '~/interfaces/product';

@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RatingModule,
    FormsModule,
    DataViewModule,
    TagModule
  ],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.scss'
})
export class CardProductComponent {
  @Input() id!: string;
  @Input() code!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() quantity!: number;
  @Input() inventoryStatus!: string;
  @Input() brand!: Brand;
  @Input() category!: string;
  @Input() likes!: number;
  @Input() image!: string;
  @Input() rating!: number;

  getSeverity(quantity: number) {
    if (quantity <= 0) {
      return { severity: 'danger', label: 'OUTOFSTOCK' };
    } else if (quantity <= 10) {
      return { severity: 'warning', label: 'LOWSTOCK' };
    } else {
      return { severity: 'success', label: 'INSTOCK' };
    }
  }
}

