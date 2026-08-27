import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Formateur } from 'src/app/models/formateur';
import { FormationFormateur } from 'src/app/models/formation-formateur';
import { ServiceFormateur } from 'src/app/models/service-formateur';
import { TitleWhy } from 'src/app/models/title-why';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-formateur',
  templateUrl: './all-formateur.component.html',
  styleUrls: [    './all-formateur.component.css',
    '../home-page/home-page.component.css',
    '../centre-formation/centre-formation.component.css' ]
})
export class AllFormateurComponent implements OnInit {
  allFormateurs: Formateur[] = [];      // liste complète, jamais filtrée — source de vérité
  formateurs: Formateur[] = [];         // liste affichée après recherche/filtre
  displayedFormateurs: Formateur[] = [];
  loading = false;

  // ===== PAGINATION =====
  itemsPerPage = 8;
  currentPage = 1;

  searchMotCle = '';
  searchCompetence = '';
  availableCompetences: string[] = [];

  sortBy: 'nom' | 'experience' = 'nom';
  dropdownOpen = false;

  constructor(private formateurService: FormateurService) {}

  ngOnInit(): void {
    this.fetchFormateurs();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  selectCompetence(competence: string): void {
    this.searchCompetence = competence;
    this.dropdownOpen = false;
    this.onSearch();   // filtre immédiatement à la sélection, sans attendre le clic sur "Rechercher"
  }

  fetchFormateurs(): void {
    this.loading = true;
    this.formateurService.getFormateur().subscribe({
      next: (data: any[]) => {
        // ⚠️ Le JSON brut de l'API n'est PAS une instance de la classe Formateur :
        // HttpClient.get<Formateur[]>(...) ne fait qu'un cast TypeScript, sans effet à
        // l'exécution. Sans ce mapping, formateur.FirstName / .Poste / .FormationFormateur
        // (les getters) renvoient tous `undefined`, silencieusement.
        this.allFormateurs = (data || []).map(item => this.toFormateur(item));
        this.formateurs = this.allFormateurs;
        this.buildAvailableCompetences();
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

  // ===== MAPPING JSON BRUT -> INSTANCES DE CLASSES =====
  private toFormateur(item: any): Formateur {
    const formations = (item.formationFormateurs || []).map((f: any) => this.toFormationFormateur(f));
    const services = (item.servicesFormateurs || []).map((s: any) => this.toServiceFormateur(s));
    const titlesWhy = (item.titleWhyList || []).map((t: any) => this.toTitleWhy(t));

    return new Formateur(
      item.id,
      item.phone,
      item.description,
      item.address,
      item.email,
      item.experience,
      item.poste,
      item.firstName,
      item.lastName,
      item.university,
      item.image,
      item.discount,
      services,
      titlesWhy,
      formations
    );
  }

  // FormationFormateur(id, title, description, formateur)
  private toFormationFormateur(item: any): FormationFormateur {
    return new FormationFormateur(item.id, item.title, item.description || [], undefined);
  }

  // ServiceFormateur(title, description) — l'id se pose ensuite via le setter
  private toServiceFormateur(item: any): ServiceFormateur {
    const service = new ServiceFormateur(item.title, item.description);
    service.Id = item.id;
    return service;
  }

  // TitleWhy(title, description) — l'id se pose ensuite via le setter
  private toTitleWhy(item: any): TitleWhy {
    const titleWhy = new TitleWhy(item.title, item.description);
    titleWhy.Id = item.id;
    return titleWhy;
  }

  // ===== HELPERS D'AFFICHAGE =====
  nomComplet(formateur: Formateur): string {
    return `${formateur.FirstName} ${formateur.LastName}`.trim();
  }

  // Les "compétences" affichées viennent uniquement des titres de formations proposées (FormationFormateur)
  competencesOf(formateur: Formateur): string[] {
    return (formateur.FormationFormateur || [])
      .map(f => f.Title)
      .filter(t => !!t);
  }

  experienceLabel(formateur: Formateur): string {
    const n = formateur.Experience;
    return n ? `${n} ans d'expérience` : '';
  }

  // Construit la liste unique de toutes les compétences (titres de formations), tous formateurs confondus
  private buildAvailableCompetences(): void {
    const competencesSet = new Set<string>();
    this.allFormateurs.forEach(formateur => {
      this.competencesOf(formateur).forEach(c => {
        if (c) competencesSet.add(c);
      });
    });
    this.availableCompetences = Array.from(competencesSet).sort((a, b) => a.localeCompare(b));
  }

  updateDisplayed(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedFormateurs = this.formateurs.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.formateurs.length / this.itemsPerPage) || 1;
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
    const el = document.getElementById('formateurs-list-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== RECHERCHE / FILTRE =====
  onSearch(): void {
    this.currentPage = 1;
    this.formateurs = this.filterByCompetence(this.filterByMotCle(this.allFormateurs));
    this.applySort();
    this.updateDisplayed();
  }

  private filterByMotCle(list: Formateur[]): Formateur[] {
    const mot = this.searchMotCle?.trim().toLowerCase();
    if (!mot) return list;
    return list.filter(f =>
      this.nomComplet(f).toLowerCase().includes(mot) ||
      (f.Poste || '').toLowerCase().includes(mot) ||
      (f.Address || '').toLowerCase().includes(mot) ||
      (f.Description || '').toLowerCase().includes(mot) ||
      this.competencesOf(f).some(c => c.toLowerCase().includes(mot))
    );
  }

  private filterByCompetence(list: Formateur[]): Formateur[] {
    if (!this.searchCompetence) return list;
    return list.filter(f => this.competencesOf(f).includes(this.searchCompetence));
  }

  onSortChange(sort: 'nom' | 'experience'): void {
    this.sortBy = sort;
    this.applySort();
    this.updateDisplayed();
  }

  private applySort(): void {
    this.formateurs = [...this.formateurs].sort((a, b) => {
      if (this.sortBy === 'experience') {
        return (Number(b.Experience) || 0) - (Number(a.Experience) || 0);
      }
      return this.nomComplet(a).localeCompare(this.nomComplet(b));
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