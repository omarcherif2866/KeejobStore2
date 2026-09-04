import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Certification } from 'src/app/models/certification';
import { Plateforme } from 'src/app/models/platforme';
import { EvaluationService } from 'src/app/services/evaluation.service';

import { CertificationService } from 'src/app/services/certification.service';
import { PlateformeService } from 'src/app/services/platforme.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-certification-category',
  templateUrl: './certification-category.component.html',
  styleUrls: ['../formation-keejob-category/formation-keejob-category.component.css']
})
export class CertificationCategoryComponent implements OnInit {

  category!: string;
  searchQuery = '';

  allCertifications: Certification[] = [];         // certifications de la catégorie (toutes plateformes confondues)
  displayedCertifications: Certification[] = [];    // certifications affichées après sélection d'une plateforme

  platforms: Plateforme[] = [];                     // TOUTES les plateformes du site
  selectedPlatform: Plateforme | null = null;

  loading = true;
carouselStartIndex = 0;

  private categoryLabels: { [key: string]: string } = {
    'Marketing_Digital': 'Marketing Digital',
    'Entrepreneuriat': 'Entrepreneuriat',
    'Langues': 'Langues',
  };
  loadingIcons = false;
  availableIcons: string[] = [];

  // Config visuelle par catégorie : couleur du highlight + image hero
  private categoryVisuals: { [key: string]: { color: string; image: string } } = {
    'Marketing_Digital': {
      color: '#4f5bd5',
      image: '../../assets/certificationMarketingDigital.webp'
    },
    'Entrepreneuriat': {
      color: '#f59e0b',
      image: '../../assets/certif_entre.webp'
    },
    'Langues': {
      color: '#22c55e',
      image: '../../assets/certif_langue.webp'
    },
  };

  constructor(
    private route: ActivatedRoute,
    private certificationService: CertificationService,
    private evaluationservice: EvaluationService,
    private plateformeService: PlateformeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = cat;
        this.selectedPlatform = null;
        this.loadData();
      }
    });
  }

loadData(): void {
  this.loading = true;

  forkJoin({
    platforms: this.plateformeService.getAll(),
    certifications: this.certificationService.getByCategory(this.category)
  }).subscribe({
    next: ({ platforms, certifications }) => {
      this.allCertifications = certifications;

      // Récupère les IDs de plateformes qui ont au moins une formation dans cette catégorie
      const plateformeIdsAvecCertifications = new Set(
        certifications
          .map(f => (f.plateforme as Plateforme)?.id)
          .filter((id): id is number => id !== undefined && id !== null)
      );

      // Ne garde que les plateformes présentes dans cet ensemble
      this.platforms = platforms.filter(p => plateformeIdsAvecCertifications.has(p.id!));

      this.loading = false;
      console.log('Certifications chargées pour la catégorie', this.category, ':', certifications);
      console.log('Plateformes filtrées:', this.platforms);
    },
    error: (err) => {
      console.error('Erreur lors du chargement des données:', err);
      this.loading = false;
    }
  });
}
  
  // loadData(): void {
  //   this.loading = true;

  //   // On charge en parallèle : toutes les plateformes + les certifications de la catégorie
  //   this.plateformeService.getAll().subscribe({
  //     next: (platforms) => {
  //       this.platforms = platforms;
  //     },
  //     error: (err) => console.error('Erreur plateformes:', err)
  //   });

  //   this.certificationService.getByCategory(this.category).subscribe({
  //     next: (data) => {
  //       this.allCertifications = data;
  //       this.loading = false;
  //       console.log('Certifications chargées pour la catégorie', this.category, ':', data);
  //     },
  //     error: (err) => {
  //       console.error('Erreur certifications:', err);
  //       this.loading = false;
  //     }
  //   });
  // }

  // Clic sur une plateforme → filtre les certifications de la catégorie appartenant à cette plateforme
  selectPlatform(platform: Plateforme): void {
    this.selectedPlatform = platform;
    this.displayedCertifications = this.allCertifications.filter(
      c => (c.plateforme as Plateforme)?.id === platform.id
    );

    setTimeout(() => {
      document.querySelector('.certifications-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  resetPlatform(): void {
    this.selectedPlatform = null;
    this.displayedCertifications = [];
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.certificationService.search(this.searchQuery).subscribe(results => {
      this.allCertifications = results;
      this.selectedPlatform = null;
      this.displayedCertifications = [];
    });
  }

  get categoryLabel(): string {
    return this.categoryLabels[this.category] || this.category;
  }

  get sectionTitle(): string {
    return `Certifications disponibles sur ${this.selectedPlatform?.nom}`;
  }

  sanitizeImage(url: string | undefined): string {
    if (!url) return '';
    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }
    return url;
  }

  getAvailableplatformeImage() {
    this.loadingIcons = true;
    this.evaluationservice.getAvailableplatformeImage().subscribe({
      next: (icons) => {
        this.availableIcons = icons;
        this.loadingIcons = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des icônes de certification:', error);
        this.availableIcons = [];
        this.loadingIcons = false;
      }
    });
  }

  private defaultVisual = { color: '#4f5bd5', image: '../../assets/certificationMarketingDigital.webp' };

  get categoryColor(): string {
    return this.categoryVisuals[this.category]?.color || this.defaultVisual.color;
  }

  get categoryImage(): string {
    return this.categoryVisuals[this.category]?.image || this.defaultVisual.image;
  }

  toggleFavorite(certification: any, event: Event): void {
    event.stopPropagation(); // empêche le clic de aussi déclencher le routerLink de la ligne
    // logique d'ajout/retrait des favoris ici
  }

  get showPlatformsCarousel(): boolean {
  return this.platforms.length > 4;
}

get visiblePlatforms(): Plateforme[] {
  if (this.platforms.length <= 4) {
    return this.platforms;
  }
  const result: Plateforme[] = [];
  const n = this.platforms.length;
  for (let i = 0; i < 4; i++) {
    result.push(this.platforms[(this.carouselStartIndex + i) % n]);
  }
  return result;
}

nextPlatformsPage(): void {
  const n = this.platforms.length;
  this.carouselStartIndex = (this.carouselStartIndex - 1 + n) % n;
}

previousPlatformsPage(): void {
  const n = this.platforms.length;
  this.carouselStartIndex = (this.carouselStartIndex + 1) % n;
}
}