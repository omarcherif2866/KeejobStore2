import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationCategory, FormationKeejob } from 'src/app/models/formation-keejob';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';

@Component({
  selector: 'app-formation-keejob-category',
  templateUrl: './formation-keejob-category.component.html',
  styleUrls: ['./formation-keejob-category.component.css']
})
export class FormationKeejobCategoryComponent implements OnInit {

  category!: FormationCategory;
  formations: FormationKeejob[] = [];
  loading = true;

  availableCategories = Object.values(FormationCategory);

  // Libellés lisibles pour chaque valeur de l'enum FormationCategory
  // ⚠️ adaptez les clés exactes selon votre enum réel (voir note en bas)
  private categoryLabels: { [key: string]: string } = {
    'Formations_langues': 'de langues',
    'Formations_office': 'office',
    'Formations_Design': 'de design'
  };

  // Config des boutons alternatifs pour chaque catégorie
  private categoryButtonConfig: { [key: string]: { label: string; icon: string } } = {
    'Formations_langues': { label: 'Voir les formations langues', icon: '🗣️' },
    'Formations_office': { label: 'Voir les formations office', icon: '💻' },
    'Formations_Design': { label: 'Voir les formations design', icon: '🎨' }
  };

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationKeejobService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = cat as FormationCategory;
        this.loadEvaluations();
      }
    });
  }

  loadEvaluations(): void {
    this.loading = true;

    this.formationService.getByCategory(this.category).subscribe({
      next: (data) => {
        this.formations = data;
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
    return this.categoryLabels[this.category] || (this.category ? this.category.toString().replace(/_/g, ' ').toLowerCase() : '');
  }

  // Nom de catégorie sans underscore, pour le fil d'ariane
  get categoryDisplay(): string {
    return this.category ? this.category.toString().replace(/_/g, ' ') : '';
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

}