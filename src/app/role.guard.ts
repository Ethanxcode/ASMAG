import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './service/auth';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private jwtHelper = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const token: any = localStorage.getItem('access_token');
    const tokenPayload = this.jwtHelper.decodeToken(token);
    if (!this.authService.isLoggedIn() || tokenPayload?.role !== expectedRole) {
      this.router.navigate(['signin']);
      return false;
    }
    return true;
  }
}

