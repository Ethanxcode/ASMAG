import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '~/service/auth';
import { CartService } from '~/service/cart';
import { HttpMethodService } from '~/service/service';
import { Toast } from '~/service/toast';

@Component({
  selector: 'app-posts-crud',
  standalone: true,
  imports: [],
  templateUrl: './posts-crud.component.html',
  styleUrl: './posts-crud.component.scss'
})
export class PostsCrudComponent {
  constructor(
    private route: ActivatedRoute,
    private http: HttpMethodService,
    private cartService: CartService,
    private toast: Toast,
    private auth: AuthService
  ) {}
}

