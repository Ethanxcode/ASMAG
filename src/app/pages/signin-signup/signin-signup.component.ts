import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { AuthService } from '~/service/auth';

import { HttpMethodService } from '~/service/service';
import { Toast } from '~/service/toast';

@Component({
  selector: 'app-signin-signup',
  standalone: true,
  imports: [
    ButtonModule,
    RippleModule,
    TagModule,
    RouterLink,
    GalleriaModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './signin-signup.component.html',
  styleUrl: './signin-signup.component.scss'
})
export class SigninSignupComponent implements OnInit {
  images!: Array<{ image: string; alt: string }>;

  user = {
    email: '',
    password: ''
  };

  currentRoute!: string;

  form!: FormGroup;

  constructor(
    private http: HttpMethodService,
    private toast: Toast,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  responsiveOptions: Array<{ breakpoint: string; numVisible: number }> = [
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

  ngOnInit() {
    this.currentRoute = this.router.url;

    this.images = [
      {
        image:
          'https://www.kicksonfire.com/wp-content/uploads/2023/10/jae-tips-saucony-progrid-omni-9-7.jpeg?x58464',
        alt: 'Description for Image 1'
      },
      {
        image:
          'https://www.kicksonfire.com/wp-content/uploads/2024/01/nicole-mclaughlin-puma-suede-2024-1.png?x58464',
        alt: 'Description for Image 2'
      },
      {
        image:
          'https://www.kicksonfire.com/wp-content/uploads/2024/01/Screen-Shot-2024-01-17-at-1-17-03-PM.png?x58464',
        alt: 'Description for Image 3'
      }
    ];
    if (this.currentRoute === '/signin') {
      this.form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(4)
        ])
      });
    } else {
      this.form = new FormGroup(
        {
          email: new FormControl(null, [Validators.required, Validators.email]),
          password: new FormControl(null, [
            Validators.required,
            Validators.minLength(4)
          ]),
          passwordConfirmation: new FormControl(null, [
            Validators.required,
            Validators.minLength(4)
          ])
        },
        { validators: this.passwordsMatch() }
      );
    }
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

  onLoginSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      this.auth.login(this.form.value.email, this.form.value.password);
    }
  }
  onRegisterSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      this.auth.register(this.form.value.email, this.form.value.password);
    }
  }
}

