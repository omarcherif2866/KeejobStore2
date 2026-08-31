import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Avis } from 'src/app/models/avis';
import { Certification } from 'src/app/models/certification';
import { AvisService } from 'src/app/services/avis.service';
import { CertificationService } from 'src/app/services/certification.service';

type Tab = 'presentation' | 'avis' | 'infos';

@Component({
  selector: 'app-certification-details',
  templateUrl: './certification-details.component.html',
  styleUrls: ['./certification-details.component.css']
})
export class CertificationDetailsComponent implements OnInit {

  certification: Certification | null = null;
  otherCertifications: Certification[] = [];
  avisList: Avis[] = [];

  loading = true;
  activeTab: Tab = 'presentation';

  // Pour le carousel "Autres certifications"
  currentSlide = 0;
  slidesCount = 0;

  constructor(
    private route: ActivatedRoute,
    private certificationService: CertificationService,
    private avisService: AvisService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCertification(+id);
      }
    });
  }

  loadCertification(id: number): void {
    this.loading = true;

    this.certificationService.getById(id).subscribe({
      next: (data) => {
        this.certification = data;
        this.loading = false;

        if (data.plateforme?.id) {
          this.loadOtherCertifications(data.plateforme.id, id);
        }
        this.loadAvis(id);
        console.log('Certification chargée:', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la certification:', err);
        this.loading = false;
      }
    });
  }

  loadOtherCertifications(plateformeId: number, currentId: number): void {
    this.certificationService.getByPlateforme(plateformeId).subscribe({
      next: (data) => {
        this.otherCertifications = data.filter(c => c.id !== currentId);
        this.slidesCount = Math.ceil(this.otherCertifications.length / 4);
      },
      error: (err) => console.error('Erreur autres certifications:', err)
    });
  }

  loadAvis(certificationId: number): void {
    this.avisService.getAvisByCertification(certificationId).subscribe({
      next: (data) => this.avisList = data,
      error: (err) => console.error('Erreur avis:', err)
    });
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

// ===================== CALCULS AVIS =====================

get averageNote(): number {
  if (!this.avisList || this.avisList.length === 0) return 0;
  const sum = this.avisList.reduce((total, a) => total + (a.note || 0), 0);
  return Math.round((sum / this.avisList.length) * 10) / 10;
}

get totalAvis(): number {
  return this.avisList.length;
}

get avisApercu(): Avis[] {
  return this.avisList.slice(0, 3);
}

stars(note: number): number[] {
  return Array(Math.round(note)).fill(0);
}

getInitiales(nomAuteur: string): string {
  if (!nomAuteur) return '';
  const parties = nomAuteur.trim().split(' ').filter(p => p.length > 0);
  if (parties.length === 0) return '';
  if (parties.length === 1) return parties[0].charAt(0).toUpperCase();
  const premiere = parties[0].charAt(0).toUpperCase();
  const derniere = parties[parties.length - 1].charAt(0).toUpperCase();
  return premiere + derniere;
}

getCouleurAvatar(nomAuteur: string): string {
  const couleurs = ['#4a90d9', '#e07a5f', '#81b29a', '#f2cc8f', '#9b5de5', '#3d5a80'];
  let hash = 0;
  for (let i = 0; i < nomAuteur.length; i++) {
    hash = nomAuteur.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % couleurs.length;
  return couleurs[index];
}

  getStarPercentage(star: number): number {
    if (this.avisList.length === 0) return 0;
    const count = this.avisList.filter(a => a.note === star).length;
    return Math.round((count / this.avisList.length) * 100);
  }

  getStarCountForBar(star: number): number {
    return this.avisList.filter(a => a.note === star).length;
  }

  // ===================== PRIX =====================

  get hasDiscount(): boolean {
    return !!this.certification?.prixOriginal && this.certification.prixOriginal > (this.certification?.prix || 0);
  }

  // ===================== CAROUSEL =====================

  nextSlide(): void {
    if (this.currentSlide < this.slidesCount - 1) this.currentSlide++;
  }

  prevSlide(): void {
    if (this.currentSlide > 0) this.currentSlide--;
  }

  goToSlide(i: number): void {
    this.currentSlide = i;
  }

  // ===================== PARTAGE =====================

  shareOn(network: 'facebook' | 'linkedin' | 'twitter'): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.certification?.titre || '');
    let shareUrl = '';

    switch (network) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
  }

  // ===================== UTILS =====================

  sanitizeImage(url: string | undefined): string {
    if (!url) return '';
    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }
    return url;
  }
}