import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Avis } from 'src/app/models/avis';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { AvisService } from 'src/app/services/avis.service';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
type Tab = 'presentation' | 'contenu' | 'avis' | 'infos';

@Component({
  selector: 'app-formation-keejob-details',
  templateUrl: './formation-keejob-details.component.html',
  styleUrls: ['./formation-keejob-details.component.css']
})
export class FormationKeejobDetailsComponent implements OnInit {


  formation: FormationKeejob | null = null;
  otherFormations: FormationKeejob[] = [];
  avisList: Avis[] = [];

  loading = true;
  activeTab: Tab = 'presentation';

  // Pour le carousel "Autres formations"
  currentSlide = 0;
  slidesCount = 0;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationKeejobService,
    private avisService: AvisService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadFormation(+id);
      }
    });
  }

  loadFormation(id: number): void {
    this.loading = true;

    this.formationService.getById(id).subscribe({
      next: (data) => {
        this.formation = data;
        this.loading = false;

        if (data.plateforme?.id) {
          this.loadOtherFormations(data.plateforme.id, id);
        }
        this.loadAvis(id);
        console.log('Formation chargée:', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la formation:', err);
        this.loading = false;
      }
    });
  }

  loadOtherFormations(plateformeId: number, currentId: number): void {
    this.formationService.getByPlateforme(plateformeId).subscribe({
      next: (data) => {
        this.otherFormations = data.filter(f => f.id !== currentId);
        this.slidesCount = Math.ceil(this.otherFormations.length / 4);
      },
      error: (err) => console.error('Erreur autres formations:', err)
    });
  }

  loadAvis(formationId: number): void {
    this.avisService.getAvisByFormation(formationId).subscribe({
      next: (data) => this.avisList = data,
      error: (err) => console.error('Erreur avis:', err)
    });
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

  // ===================== CALCULS AVIS =====================

  get averageNote(): number {
    if (!this.formation?.note) return 0;
    return this.formation.note;
  }

  get totalAvis(): number {
    return this.formation?.nombreAvis || this.avisList.length;
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
    return !!this.formation?.prixOriginal && this.formation.prixOriginal > (this.formation?.prix || 0);
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
    const text = encodeURIComponent(this.formation?.titre || '');
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

  openVideo(): void {
  // TODO: implémenter l'ouverture de la vidéo (modal, nouvelle fenêtre, etc.)
  if (this.formation?.lienBandeAnnonce) {
    window.open(this.formation.lienBandeAnnonce, '_blank');
  }
}



}