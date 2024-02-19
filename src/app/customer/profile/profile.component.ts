import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SkeletonModule } from 'primeng/skeleton';
import { UserInterface } from '~/interfaces/user';
import { HeaderComponent } from '~/layouts/header/header.component';
import { AuthService } from '~/service/auth';
import { HttpMethodService } from '~/service/service';
import { Toast } from '~/service/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    BreadcrumbModule,
    HeaderComponent,
    SkeletonModule,
    InputGroupModule,
    ButtonModule,
    InputGroupAddonModule,
    FormsModule,
    CardModule,
    CommonModule,
    NgxDropzoneModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: UserInterface;

  loaded: boolean = true;

  breadcrumb: MenuItem[] | undefined;

  home: MenuItem | undefined;

  form!: FormGroup;

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
    private toast: Toast,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.minLength(4)],
      passwordConfirmation: ['']
    });
  }

  ngOnInit(): void {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.loaded = false;

    this.user = this.auth.getUserInfo();
    if (this.user) {
      setTimeout(() => {
        this.loaded = true;
      }, 1500);
      if (this.user == null)
        this.auth.user$.subscribe(data => {
          this.user = data;
        });
    }

    this.breadcrumb = [
      { label: 'Profiles' },
      {
        label: this.cap(this.user.username)
      },
      { label: 'Settings' }
    ];

    this.form = new FormGroup(
      {
        username: new FormControl(null),
        password: new FormControl(null, [Validators.minLength(4)]),
        passwordConfirmation: new FormControl(null)
      },
      { validators: this.passwordsMatch() }
    );
  }

  cap(name: string | undefined): string {
    if (name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return '';
  }

  passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password')?.value;
      const passwordConfirmation = control.get('passwordConfirmation')?.value;
      if (password !== null && passwordConfirmation !== null) {
        return password &&
          passwordConfirmation &&
          password === passwordConfirmation
          ? null
          : { passwordsNotMatch: true };
      }
      return null;
    };
  }

  onUpdateSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const formData: Record<string, any> = {};

      if (this.form.value.username) {
        formData['username'] = this.form.value.username;
      }

      if (this.form.value.password) {
        formData['password'] = this.form.value.password;
      }

      this.auth.updateDataField(formData, this.user?.id);
      this.form.reset();
    }
  }

  handleImageChange(event: any): void {
    const input = event.target;
    const preview = document.getElementById(
      'avatarPreview'
    ) as HTMLImageElement;

    if (input.files && input.files.length > 0) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        preview.src = e.target.result;

        const formData = new FormData();
        formData.append('photo', input.files[0]);

        if (this.user && this.user.id) {
          this.auth.postImage(formData, this.user.id);
        } else {
          console.error('User or user ID is undefined');
        }
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
}

