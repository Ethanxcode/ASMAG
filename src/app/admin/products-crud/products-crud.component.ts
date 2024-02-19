import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpMethodService } from '../../service/service';
import { MainCategory, Product } from '~/interfaces/product';
import { HeaderComponent } from '~/layouts/header/header.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, SelectItem } from 'primeng/api';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GalleriaModule } from 'primeng/galleria';
import { RatingModule } from 'primeng/rating';
import { CartService } from '~/service/cart';
import { Toast } from '../../service/toast';
import { AuthService } from '~/service/auth';
import { CardModule } from 'primeng/card';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { product } from '../../interfaces/cart';

@Component({
  selector: 'app-products-crud',
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
    RatingModule,
    CardModule,
    NgxDropzoneModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './products-crud.component.html',
  styleUrl: './products-crud.component.scss'
})
export class ProductsCrudComponent implements OnInit {
  product!: Product;

  breadcrumb: MenuItem[] | undefined;

  loaded: boolean = false;

  home: MenuItem | undefined;

  form!: FormGroup;

  files: File[] = [];

  Category!: SelectItem[];

  selectedCategory: SelectItem | undefined;

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
    private router: Router,
    private toast: Toast,
    private auth: AuthService,
    private http: HttpMethodService,

    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      productName: [''],
      productCode: ['', Validators.minLength(4)],
      productQuantity: [''],
      productColorway: [''],
      productBrand: [''],
      productPrice: [''],
      productDescription: [''],
      productcategory: ['']
    });
  }

  ngOnInit(): void {
    this.handleGetCategory();

    setTimeout(() => {
      this.loaded = true;
    }, 1000);

    this.breadcrumb = [
      {
        label: 'Admin',
        command: () => {
          this.router.navigate(['/admin']);
        }
      },
      {
        label: 'Product'
      },
      {
        label: 'Create',
        command: () => {
          this.router.navigate(['/admin/new-product']);
        }
      }
    ];

    this.form = new FormGroup({
      productName: new FormControl(null),
      productCode: new FormControl(null, [Validators.minLength(4)]),
      productQuantity: new FormControl(null),
      productColorway: new FormControl(null),
      productBrand: new FormControl(null),
      productPrice: new FormControl(null),
      productDescription: new FormControl(null),
      productcategory: new FormControl(null)
    });
  }
  onUpdateSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const formData: FormData = new FormData();

      const formFields = [
        'productName',
        'productCode',
        'productBrand',
        'productPrice',
        'productDescription',
        'productQuantity',
        'productColorway',
        'productColorway'
      ];

      formFields.forEach(field => {
        if (this.form.value[field]) {
          formData.append(field, this.form.value);
        }
      });

      for (const file of this.files) {
        formData.append('photos', file);
      }

      this.auth.createNewProduct(formData);

      this.form.reset();
    }
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

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}

