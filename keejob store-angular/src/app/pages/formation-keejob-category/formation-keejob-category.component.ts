import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { Plateforme } from 'src/app/models/platforme';
import { EvaluationService } from 'src/app/services/evaluation.service';

import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
import { PlateformeService } from 'src/app/services/platforme.service';

@Component({
  selector: 'app-formation-keejob-category',
  templateUrl: './formation-keejob-category.component.html',
  styleUrls: ['./formation-keejob-category.component.css']
})
export class FormationKeejobCategoryComponent implements OnInit {

  category!: string;
  searchQuery = '';

  allFormations: FormationKeejob[] = [];       // formations de la catégorie (toutes plateformes confondues)
  displayedFormations: FormationKeejob[] = [];  // formations affichées après sélection d'une plateforme

  platforms: Plateforme[] = [];                 // TOUTES les plateformes du site
  selectedPlatform: Plateforme | null = null;

  loading = true;
carouselStartIndex = 0;

  private categoryLabels: { [key: string]: string } = {
    'Formations_langues': 'Langues',
    'Formations_office': 'Office',
    'Formations_Design': 'Design',
    'Formations_Digital': 'Digital',
  };
  loadingIcons = false;
  availableIcons: string[] = [];

// Config visuelle par catégorie : couleur du highlight + image hero
private categoryVisuals: {
  [key: string]: { color: string; image: string; blobs: [string, string, string]; layout: string }
} = {
'Formations_langues': {
  color: '#4b5bf0',
  image: '../../assets/1x/langues.webp',
  blobs: ['#e6f0fc', '#e9eefc', '#eaf3fb'],
  layout: 'blobs-aqua'
},
'Formations_office': {
  color: '#d6459b',
  image: '../../assets/1x/formation Office.webp',
  blobs: ['#fbe6f1', '#f7dcec', '#f1d3e8'],
  layout: 'blobs-rose'
},
'Formations_Design': {
  color: '#7c3aed',
  image: '../../assets/1x/formation Design.webp',
  blobs: ['#efe8fb', '#ebe3fa', '#e4d9f7'],
  layout: 'blobs-airy'
},
'Formations_Digital': {
  color: '#4f5bd5',
  image: '../../assets/1x/formation Digital.webp',
  blobs: ['#eceafb', '#e4e8fb', '#eef0fc'],
  layout: 'blobs-sky'
},
};


  private heroTitleParts: { [key: string]: { normal: string; highlight: string } } = {
  'Formations_langues': {
    normal: 'Développez vos',
    highlight: 'compétences linguistiques'
  },
  'Formations_office': {
    normal: 'Maîtrisez les outils',
    highlight: 'Office'
  },
  'Formations_Design': {
    normal: 'Développez vos compétences',
    highlight: 'en Design'
  },
  'Formations_Digital': {
    normal: 'Maîtrisez les métiers du',
    highlight: 'Digital'
  }
};

  private heroSubtitles: { [key: string]: string } = {
    'Formations_langues':
      "Des <strong>formations en langues</strong> en ligne, sélectionnées selon vos besoins et accessibles sur des plateformes reconnues.",
    'Formations_office':
      "Des <strong>formations Office</strong> en ligne pour développer vos compétences sur les outils bureautiques essentiels.",
    'Formations_Design':
      "Des <strong>formations Design</strong> en ligne pour maîtriser les outils, méthodes et techniques de création visuelle.",
    'Formations_Digital':
      "Des <strong>formations Digital</strong> en ligne pour renforcer vos compétences et évoluer dans les métiers du numérique.",
  };

  private heroFeaturesByCategory: { [key: string]: { icon: string; iconClass: string; title: string; subtitle: string }[] } = {
  'Formations_langues': [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Sélection de qualité', subtitle: 'Plateformes reconnues' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Contenus actualisés', subtitle: 'Formations adaptées' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Apprentissage flexible', subtitle: 'À votre rythme' }
  ],
  'Formations_office': [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Sélection de qualité', subtitle: 'Plateformes reconnues' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Compétences pratiques', subtitle: 'Outils et méthodes' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Apprentissage flexible', subtitle: 'À votre rythme' }
  ],
  'Formations_Design': [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Sélection de qualité', subtitle: 'Plateformes reconnues' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Compétences créatives', subtitle: 'Outils et techniques' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Apprentissage flexible', subtitle: 'À votre rythme' }
  ],
  'Formations_Digital': [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Parcours sélectionnés', subtitle: 'Formations reconnues' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Savoirs opérationnels', subtitle: 'Compétences actuelles' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Accès flexible', subtitle: 'Quand vous voulez' }
  ]
};

get heroFeatures() {
  return this.heroFeaturesByCategory[this.category] || this.heroFeaturesByCategory['Les_tests_psychometriques'];
}

  get heroSubtitle(): string {
    return this.heroSubtitles[this.category] || this.heroSubtitles['Les_tests_psychometriques'];
  }

get heroTitleNormal(): string {
  return (this.heroTitleParts[this.category] || this.heroTitleParts['Formations_langues']).normal;
}

get heroTitleHighlight(): string {
  return (this.heroTitleParts[this.category] || this.heroTitleParts['Formations_langues']).highlight;
}

get categoryBlobs(): [string, string, string] {
  return this.categoryVisuals[this.category]?.blobs ?? ['#8a4aa8', '#ef6f5b', '#f2c14e'];
}

get categoryBlobLayout(): string {
  return this.categoryVisuals[this.category]?.layout ?? 'blobs-right';
}

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationKeejobService,
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
    formations: this.formationService.getByCategory(this.category)
  }).subscribe({
    next: ({ platforms, formations }) => {
      this.allFormations = formations;

      // Récupère les IDs de plateformes qui ont au moins une formation dans cette catégorie
      const plateformeIdsAvecFormations = new Set(
        formations
          .map(f => (f.plateforme as Plateforme)?.id)
          .filter((id): id is number => id !== undefined && id !== null)
      );

      // Ne garde que les plateformes présentes dans cet ensemble
      this.platforms = platforms.filter(p => plateformeIdsAvecFormations.has(p.id!));

      this.loading = false;
      console.log('Formations chargées pour la catégorie', this.category, ':', formations);
      console.log('Plateformes filtrées:', this.platforms);
    },
    error: (err) => {
      console.error('Erreur lors du chargement des données:', err);
      this.loading = false;
    }
  });
}

  // Clic sur une plateforme → filtre les formations de la catégorie appartenant à cette plateforme
  selectPlatform(platform: Plateforme): void {
    this.selectedPlatform = platform;
    this.displayedFormations = this.allFormations.filter(
      f => (f.plateforme as Plateforme)?.id === platform.id
    );

    setTimeout(() => {
      document.querySelector('.formations-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  resetPlatform(): void {
    this.selectedPlatform = null;
    this.displayedFormations = [];
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.formationService.search(this.searchQuery).subscribe(results => {
      this.allFormations = results;
      this.selectedPlatform = null;
      this.displayedFormations = [];
    });
  }

  get categoryLabel(): string {
    return this.categoryLabels[this.category] || this.category;
  }

  get sectionTitle(): string {
    return `Formations disponibles sur ${this.selectedPlatform?.nom}`;
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
        console.error('Erreur lors du chargement des icônes de formation:', error);
        this.availableIcons = [];
        this.loadingIcons = false;
      }
    });
  }


private defaultVisual = { color: '#4f5bd5', image: '../../assets/formationDigital.webp' };

get categoryColor(): string {
  return this.categoryVisuals[this.category]?.color || this.defaultVisual.color;
}

get categoryImage(): string {
  return this.categoryVisuals[this.category]?.image || this.defaultVisual.image;
}

toggleFavorite(formation: any, event: Event): void {
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

prefetchFormation(id: number): void {
  this.formationService.getById(id).subscribe();
}

}