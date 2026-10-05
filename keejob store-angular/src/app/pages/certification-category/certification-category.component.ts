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
  styleUrls: ['./certification-category.component.css']
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
    'AI': 'AI',
  };
  loadingIcons = false;
  availableIcons: string[] = [];

  // Config visuelle par catégorie : couleur du highlight + image hero
private categoryVisuals: {
  [key: string]: { color: string; image: string; blobs: [string, string, string]; layout: string }
} = {
'Marketing_Digital': {
  color: '#4f5bd5',
  image: '../../assets/1x/certification Marketing Digital.webp',
  blobs: ['#ebe6fc', '#dde5fb', '#d0dbf7'],
  layout: 'blobs-soft'
},
  'Entrepreneuriat': {
    color: '#c9b8d9',
    image: '../../assets/1x/Entrepreneuriat.webp',
  blobs: ['#d9cff4', '#ddd4f5', '#cfc3f0'],
    layout: 'blobs-left' // arcs à gauche
  },
  'AI': {
    color: '#5a67b8',
    image: '../../assets/1x/certification AI.webp',
    blobs: ['#e3dffa', '#d8d2f8', '#cbc4f4'], // bleu-violet
    layout: 'blobs-scattered' // arcs dispersés / diagonale
  }
};


  private heroTitleParts: { [key: string]: { normal: string; highlight: string } } = {
  'Marketing_Digital': {
    normal: 'Valorisez vos compétences en',
    highlight: 'Marketing Digital'
  },
  'Entrepreneuriat': {
    normal: 'Certifiez vos compétences',
    highlight: 'entrepreneuriales'
  },
  'AI': {
    normal: 'Développez votre expertise en',
    highlight: 'Intelligence Artificielle'
  }
};

  private heroSubtitles: { [key: string]: string } = {
    'Marketing_Digital':
      "Des <strong>certifications en Marketing Digital </strong>en ligne pour valider vos acquis et renforcer votre profil professionnel.",
    'Entrepreneuriat':
      "Des <strong>certifications en Entrepreneuriat</strong> en ligne pour valider vos compétences en création, gestion et développement d’entreprise.",
    'AI':
      "Des <strong>certifications en IA</strong> en ligne pour valider vos connaissances et renforcer votre expertise dans les technologies d’intelligence artificielle.",
  };

  private heroFeaturesByCategory: { [key: string]: { icon: string; iconClass: string; title: string; subtitle: string }[] } = {
  'Marketing_Digital': [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Certifications reconnues', subtitle: 'Organismes de référence' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Compétences certifiées', subtitle: 'Savoirs validés' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Valeur professionnelle', subtitle: 'Profil renforcé' }
  ],
  'Entrepreneuriat': [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Certifications reconnues', subtitle: 'Organismes spécialisés' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Compétences validées', subtitle: 'Savoirs entrepreneuriaux' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Crédibilité renforcée', subtitle: 'Profil valorisé' }
  ],
  'AI': [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Certifications reconnues', subtitle: 'Acteurs de référence' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Expertise validée', subtitle: 'Compétences en IA' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Profil valorisé', subtitle: 'Compétences certifiées' }
  ]
};

get heroFeatures() {
  return this.heroFeaturesByCategory[this.category] || this.heroFeaturesByCategory['Les_tests_psychometriques'];
}

  get heroSubtitle(): string {
    return this.heroSubtitles[this.category] || this.heroSubtitles['Les_tests_psychometriques'];
  }

get heroTitleNormal(): string {
  return (this.heroTitleParts[this.category] || this.heroTitleParts['Marketing_Digital']).normal;
}

get heroTitleHighlight(): string {
  return (this.heroTitleParts[this.category] || this.heroTitleParts['Marketing_Digital']).highlight;
}

get categoryBlobs(): [string, string, string] {
  return this.categoryVisuals[this.category]?.blobs ?? ['#8a4aa8', '#ef6f5b', '#f2c14e'];
}

get categoryBlobLayout(): string {
  return this.categoryVisuals[this.category]?.layout ?? 'blobs-right';
}

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


  get categoryColor(): string {
    return this.categoryVisuals[this.category]?.color ;
  }

  get categoryImage(): string {
    return this.categoryVisuals[this.category]?.image ;
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

splitInTwoLines(text: string): string[] {
  if (!text) return ['', ''];
  const words = text.trim().split(' ');
  if (words.length === 1) return [text, ''];

  let bestSplit = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(' ');
    const line2 = words.slice(i).join(' ');
    const diff = Math.abs(line1.length - line2.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = i;
    }
  }
  return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
}

prefetchCertification(id: number): void {
  this.certificationService.getById(id).subscribe();
}

}