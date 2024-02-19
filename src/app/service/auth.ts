import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { HttpMethodService } from './service';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Toast } from './toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { product } from '../interfaces/cart';
import { Product } from '~/interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://9z82v4-8080.csb.app/auth';

  private jwtHelper = new JwtHelperService();
  token: string = '';

  constructor(
    private http: HttpMethodService,
    private basicHttp: HttpClient,
    private router: Router,
    private toast: Toast
  ) {}

  private isAuthenticated = false;

  private userSubject = new BehaviorSubject<any>(null);

  user$ = this.userSubject.asObservable();

  login(email: string, password: string): void {
    const user = { email, password };
    try {
      this.http.post(`${this.apiUrl}/login`, user).subscribe(
        (response: any) => {
          if (response && response.access_token) {
            this.toast.showSuccess(response.message);
            localStorage.setItem('access_token', response.access_token);
            setTimeout(() => {
              this.userSubject.next(this.getUserInfo());
              this.isAuthenticated = true;
              this.router.navigate(['/']);
            }, 500);
          }
        },
        (error: any) => {
          this.toast.showError(error.message);
        }
      );
    } catch (error: any) {
      this.toast.showError(error.message);
      return;
    }
  }

  register(email: string, password: string): void {
    try {
      this.http
        .post(`${this.apiUrl}/register`, {
          email,
          password
        })
        .subscribe(response => {
          if (response && response.access_token) {
            this.toast.showSuccess(response.message);
            setTimeout(() => {
              this.router.navigate(['/signin']);
            }, 500);
          }
        });
    } catch (error: any) {
      this.toast.showError(error.message);
      return;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.userSubject.next(null);
    this.isAuthenticated = false;
    this.router.navigate(['/signin']);
  }

  getUserInfo(): any {
    let result: any = null;
    try {
      const token: any = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (currentTimestamp > decodedToken.exp) {
          this.toast.showError(`Phiên đăng nhập đã hết hạn`);
          this.logout();
        }

        result = decodedToken;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this.toast.showError(`Error decoding token: ${error}`);
    }
    return result;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    let result: boolean = false;
    try {
      result = !!token && !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      this.toast.showError(`Error decoding token: ${error}`);
    }
    return result;
  }

  postImage(form: FormData, id: string): void {
    try {
      const headers = new HttpHeaders({
        authorization: 'Bearer ' + localStorage.getItem('access_token')
      });
      this.basicHttp
        .post(`${this.apiUrl}/upload-avatar/${id}`, form, { headers })
        .subscribe((response: any) => {
          // Replace 'any' with the appropriate type for the response
          if (response && response.access_token) {
            this.toast.showSuccess(response.message);
            setTimeout(() => {
              localStorage.setItem('access_token', response.access_token);
              this.userSubject.next(this.getUserInfo());
              this.isAuthenticated = true;
              this.router.navigate(['/']);
            }, 500);
          }
        });
    } catch (error: any) {
      // Handle unexpected errors during the try block
      this.toast.showError(error.message);
    }
  }

  // write update user fields
  updateDataField(form: Record<string, any>, id: string | undefined): void {
    try {
      this.http.put(`${this.apiUrl}/updateDataFields/${id}`, form).subscribe(
        (response: any) => {
          // Replace 'any' with the appropriate type for the response
          if (response && response.access_token) {
            this.toast.showSuccess(response.message);
            setTimeout(() => {
              localStorage.setItem('access_token', response.access_token);
              this.userSubject.next(this.getUserInfo());
              this.isAuthenticated = true;
            }, 500);
          }
        },
        (error: any) => {
          // Handle HTTP error
          if (error && error.error && error.error.message) {
            this.toast.showError(error.error.message);
          } else {
            this.toast.showError('An error occurred');
          }
        }
      );
    } catch (error: any) {
      // Handle unexpected errors during the try block
      this.toast.showError(error.message);
    }
  }

  createNewProduct(form: Record<string, any>): void {
    try {
      const headers = new HttpHeaders({
        authorization: 'Bearer ' + localStorage.getItem('access_token')
      });
      this.basicHttp
        .post(`${this.apiUrl}/create-new-product`, form, { headers })
        .subscribe(
          (response: any) => {
            // Replace 'any' with the appropriate type for the response
            if (response && response.access_token) {
              this.toast.showSuccess(response.message);
              setTimeout(() => {
                this.router.navigate(['/admin']);
              }, 500);
            }
          },
          (error: any) => {
            // Handle HTTP error
            if (error && error.error && error.error.message) {
              this.toast.showError(error.error.message);
            } else {
              this.toast.showError('An error occurred');
            }
          }
        );
    } catch (error: any) {
      // Handle unexpected errors during the try block
      this.toast.showError(error.message);
    }
  }

  updateProductField(product: Product, id: string | undefined) {
    try {
      this.http.put(`${this.apiUrl}/update-products/${id}`, product).subscribe(
        (response: any) => {
          // Replace 'any' with the appropriate type for the response
          if (response && response.status === 200) {
            this.toast.showSuccess(response.message);
          }
        },
        (error: any) => {
          // Handle HTTP error
          if (error && error.error && error.error.message) {
            this.toast.showError(error.error.message);
          } else {
            this.toast.showError('An error occurred');
          }
        }
      );
    } catch (error: any) {
      // Handle unexpected errors during the try block
      this.toast.showError(error.message);
    }
  }
  deleteProduct(id: string | undefined) {
    try {
      this.http.delete(`${this.apiUrl}/delete-products/${id}`).subscribe(
        (response: any) => {
          // Replace 'any' with the appropriate type for the response
          if (response && response.status === 200) {
            this.toast.showSuccess(response.message);
          }
        },
        (error: any) => {
          // Handle HTTP error
          if (error && error.error && error.error.message) {
            this.toast.showError(error.error.message);
          } else {
            this.toast.showError('An error occurred');
          }
        }
      );
    } catch (error: any) {
      // Handle unexpected errors during the try block
      this.toast.showError(error.message);
    }
  }
}
