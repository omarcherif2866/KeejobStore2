import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SimpleuserGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const role = this.authService.getRoleFromToken(); // ← même méthode que isAdminOrSuperAdmin
    if (role === 'SIMPLEU') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
  
}
