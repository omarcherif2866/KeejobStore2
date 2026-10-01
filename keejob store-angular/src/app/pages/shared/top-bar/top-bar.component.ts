import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { CoachingService } from 'src/app/services/coaching.service';
import { CvService } from 'src/app/services/cv.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  searchActive = false;
  isLoggedIn: boolean = false;
  username: string = '';
  showDropdown: boolean = false;
  menuOpen = false;
  activeDropdown: string | null = null;
  showUserMenu = false;
  currentUserId: number | null = null;
  isScrolled = false;

  private cvPrefetched = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cvService: CvService,
    private coachingService: CoachingService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  ngOnInit(): void {
    this.currentUserId = Number(localStorage.getItem('userId'));

    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;

      if (status) {
        const userData = localStorage.getItem('userAuth');
        if (userData) {
          const parsed = JSON.parse(userData);
          const token = parsed.accessToken;

          if (token) {
            const decoded: any = jwtDecode(token);
            this.username = decoded.sub || 'Utilisateur';
          }
        }
      } else {
        this.username = '';
      }

      this.cdr.detectChanges();
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.activeDropdown = null;
  }

  toggleDropdownMenu(name: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;

    if (this.activeDropdown === 'cv' && !this.cvPrefetched) {
      this.cvPrefetched = true;
      [1, 2, 3].forEach(id => this.prefetch(id.toString()));
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
  }

  logout(): void {
    this.authService.logout();

    Swal.fire({
      icon: 'error',
      title: 'Vous êtes deconnecté',
      showConfirmButton: false,
      timer: 1500
    });

    this.router.navigate(['/']);
  }

  closeMenu() {
    this.menuOpen = false;
    this.activeDropdown = null;
  }

  prefetch(id: string) {
    this.cvService.getById(id).subscribe();
  }

    prefetchCoaching(id: string) {
    this.coachingService.getById(id).subscribe();
  }
}