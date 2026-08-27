import { Component, OnInit } from '@angular/core';
import { CentreFormation } from 'src/app/models/centre-formation';
import { CentreFormationService } from 'src/app/services/centre-formation.service';

@Component({
  selector: 'app-centre-formation',
  templateUrl: './centre-formation.component.html',
  styleUrls: ['./centre-formation.component.css']
})
export class CentreFormationComponent implements OnInit {
   allCentres: CentreFormation[] = [];   // liste complète, jamais filtrée — source de vérité
  centres: CentreFormation[] = [];      // liste affichée après recherche/filtre
  displayedCentres: CentreFormation[] = [];
  loading = false;

  // ===== PAGINATION =====
  itemsPerPage = 8;
  currentPage = 1;

  searchLocalisation = '';
  searchFormationTitre = '';            // ← remplace searchDomaine
  availableFormationTitres: string[] = [];

  sortBy: 'note' | 'nom' | 'avis' = 'note';
dropdownOpen = false;

  constructor(private centreService: CentreFormationService) {}

  ngOnInit(): void {
    this.fetchCentres();
  }

toggleDropdown(): void {
  this.dropdownOpen = !this.dropdownOpen;
}

closeDropdown(): void {
  this.dropdownOpen = false;
}

selectFormationTitre(titre: string): void {
  this.searchFormationTitre = titre;
  this.dropdownOpen = false;
  this.onSearch();   // filtre immédiatement à la sélection, sans attendre le clic sur "Rechercher"
}


  fetchCentres(): void {
    this.loading = true;
    this.centreService.getAllCentres().subscribe({
      next: (data) => {
        this.allCentres = data;
        this.centres = data;
        this.buildAvailableFormationTitres();
        this.applySort();
        this.currentPage = 1;
        this.updateDisplayed();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Construit la liste unique de tous les titres de formation, tous centres confondus
  private buildAvailableFormationTitres(): void {
    const titresSet = new Set<string>();
    this.allCentres.forEach(centre => {
      (centre.formations || []).forEach(f => {
        if (f.titre) titresSet.add(f.titre);
      });
    });
    this.availableFormationTitres = Array.from(titresSet).sort((a, b) => a.localeCompare(b));
  }

  updateDisplayed(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCentres = this.centres.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.centres.length / this.itemsPerPage) || 1;
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayed();
    this.scrollToListTop();
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  private scrollToListTop(): void {
    const el = document.getElementById('centres-list-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== RECHERCHE / FILTRE =====
  onSearch(): void {
    this.currentPage = 1;

    if (this.searchLocalisation?.trim()) {
      this.loading = true;
      this.centreService.searchByLocalisation(this.searchLocalisation).subscribe({
        next: (data) => {
          this.centres = this.filterByFormationTitre(data);
          this.applySort();
          this.updateDisplayed();
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
      return;
    }

    this.centres = this.filterByFormationTitre(this.allCentres);
    this.applySort();
    this.updateDisplayed();
  }

  private filterByFormationTitre(list: CentreFormation[]): CentreFormation[] {
    if (!this.searchFormationTitre) return list;
    return list.filter(centre =>
      (centre.formations || []).some(f => f.titre === this.searchFormationTitre)
    );
  }

  onSortChange(sort: 'note' | 'nom' | 'avis'): void {
    this.sortBy = sort;
    this.applySort();
    this.updateDisplayed();
  }

  private applySort(): void {
    this.centres = [...this.centres].sort((a, b) => {
      if (this.sortBy === 'note') return (b.note || 0) - (a.note || 0);
      if (this.sortBy === 'avis') return (b.nombreAvis || 0) - (a.nombreAvis || 0);
      return (a.nom || '').localeCompare(b.nom || '');
    });
  }

  sanitizeImage(url: string | null): string {
    if (!url) return '';
    if (url.includes('https://res.cloudinary.com') && url.split('https://res.cloudinary.com').length > 2) {
      const parts = url.split('https://res.cloudinary.com/daxkymr4t/image/upload/');
      return 'https://res.cloudinary.com/daxkymr4t/image/upload/' + parts[parts.length - 1];
    }
    return url;
  }
}