import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cv } from 'src/app/models/cv';
import { CvService } from 'src/app/services/cv.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { CvRequestService } from 'src/app/services/cv-request.service';

@Component({
  selector: 'app-cv-details',
  templateUrl: './cv-details.component.html',
  styleUrls: ['./cv-details.component.css']
})
export class CvDetailsComponent implements OnInit {
  cvId!: number;
  loading = false;
  cvs: Cv[] = [];
  private routeSub!: Subscription;
formData = {
  fullname: '',
  email: '',
  whatsapp: ''
};
selectedFile: File | null = null;
sending = false;
  constructor(
    private cvService: CvService, private partenaireService: PartenaireService,  private route: ActivatedRoute,private cvRequestService: CvRequestService) { }


  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.cvId = Number(params.get('id'));
      this.fetchCvById(this.cvId);
    });
  }

    ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

    fetchCvById(id: number) {
      this.loading = true;
      this.cvService.getCvById(id).subscribe({
        next: (response: any) => {
          // Mettre UNE SEULE évaluation dans le tableau
          this.cvs = [new Cv(response)];
          this.loading = false;
          console.log('cvs chargée:', this.cvs[0]);
          
        },
        error: (error) => {
          console.error('Erreur lors du chargement de cv:', error);
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
  return colors[i % 3];   // cycle automatiquement
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
    this.selectedFile = input.files[0];
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
      cvFile: this.selectedFile,
      serviceName: cvName        // ← récupéré automatiquement depuis cv.name
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
    this.selectedFile = null;
  }

}
