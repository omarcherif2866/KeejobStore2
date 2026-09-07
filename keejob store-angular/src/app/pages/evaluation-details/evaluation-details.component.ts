// evaluation-details.component.ts
import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { CvRequestService } from 'src/app/services/cv-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation-details.component.css'] // = ton CSS "cv-details" fourni
})
export class EvaluationDetailsComponent implements OnInit, OnDestroy {

  ev: Evaluation | null = null;
  loading = true;
  notFound = false;

  formData = {
    fullname: '',
    email: '',
    whatsapp: ''
  };
  selectedFiles: File[] = [];
  sending = false;
  zoomedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private evaluationService: EvaluationService,
    private evaluationRequestService: CvRequestService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.load(id);
    });
  }

  load(id: string): void {
    this.loading = true;
    this.notFound = false;
    this.evaluationService.getEvaluationById(id).subscribe({
      next: (data) => {
        this.ev = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.ev = null;
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  sanitizeImage(url: string | null | undefined): string {
    if (!url) return '';
    if (url.includes('https://res.cloudinary.com') && url.split('https://res.cloudinary.com').length > 2) {
      const parts = url.split('https://res.cloudinary.com/daxkymr4t/image/upload/');
      return 'https://res.cloudinary.com/daxkymr4t/image/upload/' + parts[parts.length - 1];
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

  splitInTwoLines(text: string | null | undefined): string[] {
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  submitForm() {
    if (!this.ev) return;

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

    this.evaluationRequestService.sendCvRequest({
      fullname: this.formData.fullname,
      email: this.formData.email,
      whatsapp: this.formData.whatsapp,
      cvFiles: this.selectedFiles,
      serviceName: this.ev.Name || ''
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


openZoom(image: string): void {
  this.zoomedImage = this.sanitizeImage(image) as string;
  document.body.classList.add('no-scroll');
}

closeZoom(): void {
  this.zoomedImage = null;
  document.body.classList.remove('no-scroll');
}

ngOnDestroy(): void {
  document.body.classList.remove('no-scroll');
}
}