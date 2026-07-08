import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evaluation, EvaluationCategory } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-evaluation-category',
  templateUrl: './evaluation-category.component.html',
  styleUrls: ['./evaluation-category.component.css']
})
export class EvaluationCategoryComponent implements OnInit {

  category!: EvaluationCategory;
  evaluations: Evaluation[] = [];
  loading = true;

  availableCategories = Object.values(EvaluationCategory);

  // Libellés lisibles pour chaque valeur de l'enum EvaluationCategory
  // ⚠️ adaptez les clés exactes selon votre enum réel (voir note en bas)
  private categoryLabels: { [key: string]: string } = {
    'Les_tests_psychometriques': 'de tests psychométriques',
    'Les_tests_de_competences': 'de tests de compétences'
  };

  // Config des boutons alternatifs pour chaque catégorie
  private categoryButtonConfig: { [key: string]: { label: string; icon: string } } = {
    'Les_tests_psychometriques': { label: 'Voir les tests psychométriques', icon: '🧠' },
    'Les_tests_de_competences': { label: 'Voir les tests de compétences', icon: '📊' }
  };

  constructor(
    private route: ActivatedRoute,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = cat as EvaluationCategory;
        this.loadEvaluations();
      }
    });
  }

  loadEvaluations(): void {
    this.loading = true;

    this.evaluationService.getByCategory(this.category).subscribe({
      next: (data) => {
        this.evaluations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }

  onCategoryChange(event: any) {
    this.category = event.target.value;
    this.loadEvaluations();
  }

  get categoryLabel(): string {
    return this.categoryLabels[this.category] || (this.category ? this.category.toString().toLowerCase() : '');
  }

  // Retourne les catégories AUTRES que celle affichée actuellement
get otherCategories(): { key: string; label: string; icon: string }[] {
  return this.availableCategories
    .filter(cat => cat !== this.category)
    .map(cat => ({
      key: cat,
      label: this.categoryButtonConfig[cat]?.label || cat.toString().replace(/_/g, ' '),
      icon: this.categoryButtonConfig[cat]?.icon || ''
    }));
}



  sanitizeImage(url: string): string {
    if (!url) return '';
    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }
    return url;
  }

  // Retourne le nom de la catégorie actuelle, sans underscore, pour l'affichage (ex: fil d'ariane)
get categoryDisplay(): string {
  return this.category ? this.category.toString().replace(/_/g, ' ') : '';
}

}