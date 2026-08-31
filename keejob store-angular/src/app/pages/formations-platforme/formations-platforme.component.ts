import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FormationKeejobService } from '../../services/formation-keejob.service';
import { Plateforme } from 'src/app/models/platforme';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { PlateformeService } from 'src/app/services/platforme.service';

@Component({
  selector: 'app-formations-platforme',
  templateUrl: './formations-platforme.component.html',
  styleUrls: ['./formations-platforme.component.css']
})
export class FormationsPlatformeComponent implements OnInit {

  allFormations: FormationKeejob[] = [];
  paginatedFormations: FormationKeejob[] = [];
  loading = true;
  errorMessage: string | null = null;

  // Plateforme courante
  plateforme: Plateforme | null = null;

  // Pagination
  pageSize = 8;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationKeejobService,
    private plateformeService: PlateformeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadPlateforme(id);
        this.loadData(id);
      }
    });
  }

  private loadPlateforme(plateformeId: number): void {
    this.plateformeService.getById(plateformeId).subscribe({
      next: (plateforme) => {
        this.plateforme = plateforme;
      },
      error: () => {
        this.plateforme = null;
      }
    });
  }

  private loadData(plateformeId: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.formationService.getByPlateforme(plateformeId).subscribe({
      next: (formations) => {
        this.allFormations = formations;
        this.totalPages = Math.max(1, Math.ceil(this.allFormations.length / this.pageSize));
        this.currentPage = 1;
        this.updatePage();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les formations pour le moment.';
        this.loading = false;
      }
    });
  }

  private updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedFormations = this.allFormations.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.updatePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  sanitizeImage(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  toggleFavorite(formation: FormationKeejob, event: Event): void {
    event.stopPropagation();
    // TODO: brancher sur votre service de favoris
  }
}