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

  private categoryLabels: { [key: string]: string } = {
    'Formations_langues': 'Langues',
    'Formations_office': 'Office',
    'Formations_Design': 'Design',
    'Formations_Digital': 'Digital',
  };
  loadingIcons = false;
  availableIcons: string[] = [];

// Config visuelle par catégorie : couleur du highlight + image hero
private categoryVisuals: { [key: string]: { color: string; image: string } } = {
  'Formations_langues': {
    color: '#22c55e', // vert
    image: '../../assets/formationLangues.webp'
  },
  'Formations_office': {
    color: '#f59e0b', // orange
    image: '../../assets/formationOffice.webp'
  },
  'Formations_Design': {
    color: '#ec4899', // rose
    image: '../../assets/formationDesign.webp'
  },
  'Formations_Digital': {
    color: '#4f5bd5', // bleu/violet (couleur par défaut de votre thème)
    image: '../../assets/formationDigital.webp'
  },
};

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
}