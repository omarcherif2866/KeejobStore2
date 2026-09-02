
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MarketJob';
  showTopBar = true;
  showFooter = true;
isRouteLoading = false;
isLoading = true;

  constructor(private router: Router) {

    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Masquer TopBar sur ActualiteComponent et FormateurComponent
        this.showTopBar = !(
          event.url.includes('/actualites') || event.url.includes('/formateurs')|| event.url.includes('/evaluations')|| event.url.includes('/formationFormateur')
          || event.url.includes('/serviceFormateur')||   event.url.match(/\/partenaire(\/|$)/) || event.url.includes('/formationKeejob')|| event.url === '/cv'
          || event.url === '/coaching' || event.url.includes('/profil') || event.url.includes('/forgot-password') || event.url.includes('/verify-code') 
          || event.url.includes('/reset-password') || event.url.includes('/login') || event.url.includes('/register') || event.url === '/centre' || event.url === '/certifications'
          || event.url === '/platforme'
        );
        this.showFooter = !(
          event.url.includes('/actualites') || event.url.includes('/formateurs')|| event.url.includes('/evaluations')|| event.url.includes('/formationFormateur')
          || event.url.includes('/serviceFormateur')||   event.url.match(/\/partenaire(\/|$)/) || event.url.includes('/formationKeejob')|| event.url === '/cv'
          || event.url === '/coaching' || event.url.includes('/profil') || event.url.includes('/forgot-password') || event.url.includes('/verify-code') 
          || event.url.includes('/reset-password') || event.url.includes('/login') || event.url.includes('/register') || event.url === '/centre' || event.url === '/certifications'
          || event.url === '/platforme'
        );
      }
    });
  }

ngOnInit() {
  setTimeout(() => {
    this.isLoading = false;
  }, 1000); // ajuste la durée selon tes besoins
}

}