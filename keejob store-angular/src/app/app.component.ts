import { Component, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MarketJob';
  showTopBar = true;
  showFooter = true;
  isLoading = true;
  showScrollTop = false;

  private footerTimeout: any;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.isLoading = true;
        clearTimeout(this.footerTimeout); // annule un délai précédent encore en cours
      }

      if (event instanceof NavigationEnd) {
        this.showTopBar = !(
          event.url.includes('/actualites') || event.url.includes('/formateurs') || event.url.includes('/evaluations') || event.url.includes('/formationFormateur')
          || event.url.includes('/serviceFormateur') || event.url.match(/\/partenaire(\/|$)/) || event.url.includes('/formationKeejob') || event.url === '/cv'
          || event.url === '/coaching' || event.url.includes('/profil') || event.url.includes('/forgot-password') || event.url.includes('/verify-code')
          || event.url.includes('/reset-password') || event.url.includes('/login') || event.url.includes('/register') || event.url === '/centre' || event.url === '/certifications'
          || event.url === '/platforme'
        );
        this.showFooter = !(
          event.url.includes('/actualites') || event.url.includes('/formateurs') || event.url.includes('/evaluations') || event.url.includes('/formationFormateur')
          || event.url.includes('/serviceFormateur') || event.url.match(/\/partenaire(\/|$)/) || event.url.includes('/formationKeejob') || event.url === '/cv'
          || event.url === '/coaching' || event.url.includes('/profil') || event.url.includes('/forgot-password') || event.url.includes('/verify-code')
          || event.url.includes('/reset-password') || event.url.includes('/login') || event.url.includes('/register') || event.url === '/centre' || event.url === '/certifications'
          || event.url === '/platforme'
        );

        this.footerTimeout = setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      }
    });
  }

  ngOnInit() {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}