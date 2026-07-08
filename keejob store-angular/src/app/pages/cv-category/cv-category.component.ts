import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cv, CVCategory } from 'src/app/models/cv';
import { CvService } from 'src/app/services/cv.service';

@Component({
  selector: 'app-cv-category',
  templateUrl: './cv-category.component.html',
  styleUrls: ['./cv-category.component.css']
})
export class CvCategoryComponent implements OnInit {

  category!: CVCategory;
  cvs: Cv[] = [];
  loading = true;

  availableCategories = Object.values(CVCategory);

  // Libellés lisibles pour chaque valeur de l'enum CVCategory
  // ⚠️ adaptez les clés exactes selon votre enum réel (voir note en bas)
  private categoryLabels: { [key: string]: string } = {
    'Correction_et_redaction_de_CV': 'de correction et rédaction de CV',
    'Correction_et_redaction_de_LM': 'de correction et rédaction de lettre de motivation',
    'Traduction_de_CV_et_LM': 'de traduction de CV et lettre de motivation'
  };

  // Config des boutons alternatifs pour chaque catégorie
  private categoryButtonConfig: { [key: string]: { label: string; icon: string } } = {
    'Correction_et_redaction_de_CV': { label: 'Correction et rédaction de CV', icon: '📄' },
    'Correction_et_redaction_de_LM': { label: 'Correction et rédaction de LM', icon: '✍️' },
    'Traduction_de_CV_et_LM': { label: 'Traduction de CV et LM', icon: '🌐' }
  };

  constructor(
    private route: ActivatedRoute,
    private cvService: CvService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = cat as CVCategory;
        this.loadEvaluations();
      }
    });
  }

  loadEvaluations(): void {
    this.loading = true;

    this.cvService.getByCategory(this.category).subscribe({
      next: (data) => {
        this.cvs = data;
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