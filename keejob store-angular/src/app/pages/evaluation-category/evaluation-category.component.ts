// evaluation-category.component.ts
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

  private categoryLabels: { [key: string]: string } = {
    'Les_tests_psychometriques': 'de tests psychométriques',
    'Les_tests_de_competences': 'de tests de compétences'
  };

  private categoryButtonConfig: { [key: string]: { label: string; icon: string } } = {
    'Les_tests_psychometriques': { label: 'Voir les tests psychométriques', icon: '🧠' },
    'Les_tests_de_competences': { label: 'Voir les tests de compétences', icon: '📊' }
  };

  // ===================== CONTENU STATIQUE CENTRAL TEST (extrait du PPTX) =====================

  centralTestLogo = 'assets/logo/central-test-logo.webp';
  heroImage = 'assets/central-test-hero.webp';

  heroSubtitle =
    "Keejob, avec son partenaire français Central Test, met à votre disposition un service " +
    "d'évaluation et de tests pour vos futurs recrutés ou vos collaborateurs, en vue de programmes " +
    "de formation ou de mobilité.";

  heroFeatures = [
    { icon: '🛡️', iconClass: 'icon-blue', title: 'Solution certifiée', subtitle: 'Partenaire officiel Central Test' },
    { icon: '🎯', iconClass: 'icon-orange', title: 'Adapté au marché tunisien', subtitle: 'Packs étudiés localement' },
    { icon: '⭐', iconClass: 'icon-yellow', title: 'Accompagnement expert', subtitle: 'Sélection et interprétation' }
  ];

  solutionParagraphs = [
    "Keejob avec son partenaire français Central Test met à votre disposition un service d'évaluation " +
    "et de tests pour vos futurs recrutés ou vos collaborateurs en vue de programme de formation ou de mobilité.",
    "Ces tests concernent aussi bien l'aspect psychotechnique (personnalité, aptitudes professionnelles, " +
    "notamment vente et managériale) que des aspects d'ordre technique (langues, Ms Office, IT, Finance...).",
    "Nos packs ont été étudiés et adaptés aux spécificités du marché tunisien."
  ];

  benefits = [
    "Anticipez la réussite d'un candidat dans un poste en décelant les subtilités de la personnalité et du comportement au travail par une évaluation multicritères,",
    "Sécurisez vos prises de décision grâce à une analyse fiable de vos candidats,",
    "Retenez uniquement les profils compatibles avec vos valeurs,",
    "Assurez-vous qu'il n'y ait pas de décalage entre les aspirations du candidat avec l'environnement de travail proposé,",
    "Réduisez les coûts associés au turnover."
  ];

  reportExampleText =
    "Chaque évaluation Central Test donne lieu à un rapport détaillé : résumé du profil, traits qui se " +
    "démarquent le plus, compétences au travail et graphique des résultats par facteur, pour une lecture " +
    "claire et actionnable des résultats du candidat.";

  references = [
    { sector: 'Banque / Microfinance / Assurance', names: ['Amen Bank', 'STB Bank', 'Wifak Bank', 'CFE', 'Caisse des Dépôts et Consignations', 'Maghrebia'] },
    { sector: 'Tourisme / Santé', names: ['Four Seasons Hotels and Resorts', 'Amen Santé'] },
    { sector: 'Industrie / Distribution', names: ['Leoni', 'Hutchinson', 'UHD', 'Indigo Company', 'Lilas', 'OneTech'] }
  ];

  // Logos utilisés dans le carrousel automatique (remplacer les chemins par tes assets réels)
  allReferences = [
    { name: 'Amen Bank', logo: 'assets/logo/amen-bank.webp' },
    { name: 'STB Bank', logo: 'assets/logo/stb-bank.webp' },
    { name: 'Wifak Bank', logo: 'assets/logo/wifak-bank.webp' },
    { name: 'CFE', logo: 'assets/logo/cfe.webp' },
    { name: 'Caisse des Dépôts et Consignations', logo: 'assets/logo/cdc.webp' },
    { name: 'Maghrebia', logo: 'assets/logo/maghrebia.webp' },
    { name: 'Four Seasons Hotels and Resorts', logo: 'assets/logo/four-seasons.webp' },
    { name: 'Amen Santé', logo: 'assets/logo/amen-sante.webp' },
    { name: 'Leoni', logo: 'assets/logo/leoni.webp' },
    { name: 'Hutchinson', logo: 'assets/logo/hutchinson.webp' },
    { name: 'UHD', logo: 'assets/logo/uhd.webp' },
    { name: 'Indigo Company', logo: 'assets/logo/indigo.webp' },
    { name: 'Lilas', logo: 'assets/logo/lilas.webp' },
    { name: 'OneTech', logo: 'assets/logo/onetech.webp' }
  ];

  // contacts = [
  //   { name: 'Selima BEN SALEM', role: 'Directrice Opérationnelle', phone: '(+216) 26 560 103', email: 'selima.bensalem@partnerrecruitment.tn', photo: 'assets/experts/selima-ben-salem.webp' },
  //   { name: 'Wiem MATTOUSSI', role: 'Directrice relation client Keejob et chargée événementiel', phone: '(+216) 26 560 294', email: 'wiem.mattoussi@keejob.com', photo: 'assets/experts/wiem-mattoussi.webp' }
  // ];

  // address = '29 Rue Abou Tammam, Cité Jardins, 1002 Tunis, Tunisie';

  // ===================== FIN CONTENU STATIQUE =====================

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
        this.evaluations = [];
        this.loading = false;
      }
    });
  }

  get categoryLabel(): string {
    return this.categoryLabels[this.category] || (this.category ? this.category.toString().toLowerCase() : '');
  }

  get categoryDisplay(): string {
    return this.category ? this.category.toString().replace(/_/g, ' ') : '';
  }

  get otherCategories(): { key: string; label: string; icon: string }[] {
    return this.availableCategories
      .filter(cat => cat !== this.category)
      .map(cat => ({
        key: cat,
        label: this.categoryButtonConfig[cat]?.label || cat.toString().replace(/_/g, ' '),
        icon: this.categoryButtonConfig[cat]?.icon || ''
      }));
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