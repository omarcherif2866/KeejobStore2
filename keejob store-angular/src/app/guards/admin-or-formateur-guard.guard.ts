import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminOrFormateurGuardGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const role = this.authService.getRoleFromToken();
    if (role === 'Admin' || role === 'SUPERADMIN' || role === 'FORMATEUR') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
  
}
