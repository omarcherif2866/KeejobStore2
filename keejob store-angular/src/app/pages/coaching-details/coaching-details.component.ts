import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Coaching } from 'src/app/models/coaching';
import { CoachingService } from 'src/app/services/coaching.service';
import { CvRequestService } from 'src/app/services/cv-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coaching-details',
  templateUrl: './coaching-details.component.html',
  styleUrls: ['./coaching-details.component.css']
})
export class CoachingDetailsComponent implements OnInit {
  private routeSub!: Subscription;

  coachingId!: number;
  loading = false;
  coachings: Coaching[] = [];
  currentIndexPartners = 0;
  visiblePartners: any[] = [];
  formData = {
    fullname: '',
    email: '',
    whatsapp: ''
  };
  selectedFiles: File[] = [];
  sending = false;
  categoryCoaching!: string;

  constructor(
    private coachingService: CoachingService,
    private cvRequestService: CvRequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.coachingId = Number(params.get('id'));
      this.fetchCoachingById(this.coachingId);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

fetchCoachingById(id: number) {
  this.loading = true;

  this.coachingService.getById(id).subscribe({
    next: (response: any) => {
      console.log('Réponse brute de l\'API:', response);   // ← ajouté

      this.coachings = [new Coaching(response)];
      console.log('Objet Coaching après transformation:', this.coachings[0]);   // ← ajouté

      this.categoryCoaching = this.coachings[0]?.Category;
      console.log('categoryCoaching:', this.categoryCoaching);   // ← ajouté

      this.loading = false;
    },
    error: (error) => {
      console.error('Erreur chargement Coaching:', error);
      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Erreur lors du chargement des données',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}

  sanitizeImage(url: string | null): string {
    if (!url) return '';

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }

    return url;
  }

  getColorClass(i: number): string {
    const colors = ['card-blue', 'card-green', 'card-yellow'];
    return colors[i % 3];
  }

  getBadgeClass(i: number): string {
    const badges = ['badge-blue', 'badge-green', 'badge-orange'];
    return badges[i % 3];
  }

  getBtnClass(i: number): string {
    const btns = ['btn-blue', 'btn-green', 'btn-orange'];
    return btns[i % 3];
  }

  getIconColor(i: number): string {
    const colors = ['#5958A0', '#4caf50', '#f59e0b'];
    return colors[i % 3];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  submitForm(cvName: string) {
    if (!this.formData.fullname || !this.formData.email || !this.formData.whatsapp) {
      Swal.fire({
        icon: 'warning',
        title: 'Merci de remplir tous les champs',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.sending = true;

    this.cvRequestService.sendCvRequest({
      fullname: this.formData.fullname,
      email: this.formData.email,
      whatsapp: this.formData.whatsapp,
      cvFiles: this.selectedFiles,
      serviceName: cvName
    }).subscribe({
      next: () => {
        this.sending = false;
        Swal.fire({ icon: 'success', title: 'Demande envoyée !', showConfirmButton: false, timer: 1500 });
        this.resetForm();
      },
      error: () => {
        this.sending = false;
        Swal.fire({ icon: 'error', title: "Erreur lors de l'envoi", showConfirmButton: false, timer: 1500 });
      }
    });
  }

  private resetForm() {
    this.formData = { fullname: '', email: '', whatsapp: '' };
    this.selectedFiles = [];
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

    return [
      words.slice(0, bestSplit).join(' '),
      words.slice(bestSplit).join(' ')
    ];
  }

  private statsLabelsByCategory: { [key: string]: string } = {
    'Simulation_dentretint': 'Simulations réalisées'
  };

  get coachingsStatLabel(): string {
    return this.statsLabelsByCategory[this.categoryCoaching] || 'Coachings réalisés';
  }

twoLines(text: string): string {
  if (!text) return text;
  const words = text.trim().split(' ');
  if (words.length < 2) return text;

  let bestIndex = 1;
  let bestDiff = Infinity;
  let cumulative = 0;

  for (let i = 0; i < words.length - 1; i++) {
    cumulative += words[i].length + 1;
    const diff = Math.abs(cumulative - text.length / 2);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i + 1;
    }
  }

  return words.slice(0, bestIndex).join(' ') + '\n' + words.slice(bestIndex).join(' ');
}

}