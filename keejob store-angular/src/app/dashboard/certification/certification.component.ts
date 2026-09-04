import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CategoryCertification, Certification } from 'src/app/models/certification';
import { CertificationService } from 'src/app/services/certification.service';
import { AuthService } from 'src/app/services/auth.service';
// ⚠️ Adaptez le chemin/nom si votre service de plateformes est différent
import { PlateformeService } from 'src/app/services/platforme.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.css']
})
export class CertificationComponent implements OnInit {
  sidebarOpen = true;
  certifications: Certification[] = [];
  loading = false;

  currentPage = 1;
  itemsPerPage = 5;

  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentModalStep = 1;
  totalSteps = 5;

  categoryEnum = CategoryCertification;
  availableCategories = Object.values(CategoryCertification);

  // ⚠️ typé "any" car le modèle Plateforme n'a pas été fourni : adaptez les champs utilisés (nom, id, ...)
  plateformes: any[] = [];
  loadingPlateformes = false;
  selectedPlateformeId: number | null = null;

  editId: number | null = null;
  selectedImage: File | null = null;

  formData: Certification = this.getEmptyCertification();

  constructor(
    private certificationService: CertificationService,
    private plateformeService: PlateformeService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchCertifications();
    this.fetchPlateformes();
  }

  private getEmptyCertification(): Certification {
    return {
      titre: '',
      badge: '',
      image: '',
      organismeEmetteur: '',
      lienCertification: '',
      descriptionCourte: '',
      aPropos: '',
      // note: 0,
      // nombreAvis: 0,
      nombreCertifies: '',
      niveau: '',
      dureeExamen: '',
      dureeValidite: '',
      langue: '',
      modaliteExamen: '',
      derniereMiseAJour: '',
      prix: 0,
      prixOriginal: 0,
      reduction: 0,
      scoreMinimum: 0,
      tauxReussite: 0,
      diplomeInclus: false,
      garantieRemboursement: '',
      categoryCertification: undefined,
      avantages: [],
      competencesValidees: [],
      publicCible: []
    };
  }

  // ===================== LISTE =====================

  fetchCertifications() {
    this.loading = true;
    this.certificationService.getAll().subscribe({
      next: (data: Certification[]) => {
        this.certifications = [...data].sort((a, b) => (a.id || 0) - (b.id || 0));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des certifications:', error);
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

  fetchPlateformes() {
    this.loadingPlateformes = true;
    this.plateformeService.getAll().subscribe({
      next: (data: any[]) => {
        this.plateformes = data || [];
        this.loadingPlateformes = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plateformes:', error);
        this.loadingPlateformes = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger la liste des plateformes',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  getPlateformeName(p: any): string {
    if (!p) return '';
    return p.nom || p.nomPlateforme || p.name || `Plateforme #${p.id}`;
  }

  getPlateformeNameById(id: number | null | undefined): string {
    if (!id) return 'Non renseignée';
    const p = this.plateformes.find(pf => pf.id === id);
    return p ? this.getPlateformeName(p) : `Plateforme #${id}`;
  }

  get currentItems(): Certification[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.certifications.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.certifications.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'info',
      title: 'Déconnexion',
      text: 'Vous êtes déconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/']);
  }

  // ===================== MODAL =====================

  handleAdd() {
    this.modalMode = 'add';
    this.formData = this.getEmptyCertification();
    this.selectedImage = null;
    this.selectedPlateformeId = null;
    this.editId = null;
    this.currentModalStep = 1;
    this.showModal = true;
    this.updatePrix();
  }

  handleEdit(certification: Certification) {
    this.modalMode = 'edit';

    this.formData = {
      ...this.getEmptyCertification(),
      ...certification,
      avantages: certification.avantages ? certification.avantages.map(a => ({ ...a })) : [],
      competencesValidees: certification.competencesValidees ? [...certification.competencesValidees] : [],
      publicCible: certification.publicCible ? [...certification.publicCible] : []
    };

    this.editId = certification.id ?? null;
    this.selectedImage = null;

    const plateformeVal: any = certification.plateforme;
    this.selectedPlateformeId = plateformeVal?.id ?? null;

    this.currentModalStep = 1;
    this.showModal = true;
    this.updatePrix();
  }

  closeModal() {
    this.showModal = false;
    this.formData = this.getEmptyCertification();
    this.selectedImage = null;
    this.selectedPlateformeId = null;
    this.editId = null;
    this.currentModalStep = 1;
  }

  handleDelete(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.certificationService.delete(id).subscribe({
          next: () => {
            this.certifications = this.certifications.filter(item => item.id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Certification supprimée avec succès',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur lors de la suppression',
              text: error?.error?.message || error?.message || 'Une erreur est survenue',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

  // ===================== STEPPER =====================

  nextModalStep() {
    if (this.currentModalStep === 1) {
      if (!this.formData.titre) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs manquants',
          text: 'Veuillez remplir le titre',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      if (this.modalMode === 'add' && !this.selectedImage) {
        Swal.fire({
          icon: 'warning',
          title: 'Image manquante',
          text: 'Veuillez sélectionner une image',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      if (!this.selectedPlateformeId) {
        Swal.fire({
          icon: 'warning',
          title: 'Plateforme manquante',
          text: 'Veuillez sélectionner une plateforme',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
    }

    if (this.currentModalStep < this.totalSteps) {
      this.currentModalStep++;
    }
  }

  previousModalStep() {
    if (this.currentModalStep > 1) {
      this.currentModalStep--;
    }
  }

  goToModalStep(step: number) {
    if (step <= this.currentModalStep) {
      this.currentModalStep = step;
    }
  }

  // ===================== PRIX (calculé automatiquement) =====================

  updatePrix() {
    const original = this.formData.prixOriginal || 0;
    const reduc = this.formData.reduction || 0;
    const computed = original - (original * reduc / 100);
    this.formData.prix = Math.round(computed * 100) / 100;
  }

  // ===================== IMAGE PRINCIPALE =====================

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une image valide',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "L'image ne doit pas dépasser 5MB",
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    this.selectedImage = file;
  }

  sanitizeImage(url: string | null | undefined): string {
    if (!url) return '';

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }

    return url;
  }

  // ===================== AVANTAGES =====================

  addAvantage() {
    this.formData.avantages = this.formData.avantages || [];
    this.formData.avantages.push({ titre: '' });
  }

  removeAvantage(index: number) {
    Swal.fire({
      title: 'Supprimer cet avantage?',
      text: "Cette action est irréversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#666',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formData.avantages?.splice(index, 1);
      }
    });
  }

  countCompletedAvantages(): number {
    return (this.formData.avantages || []).filter(a => a.titre && a.titre.trim() !== '').length;
  }

  // ===================== COMPÉTENCES / PUBLIC CIBLE =====================

  addCompetence() {
    this.formData.competencesValidees = this.formData.competencesValidees || [];
    this.formData.competencesValidees.push('');
  }

  removeCompetence(index: number) {
    this.formData.competencesValidees?.splice(index, 1);
  }

  addPublicCible() {
    this.formData.publicCible = this.formData.publicCible || [];
    this.formData.publicCible.push('');
  }

  removePublicCible(index: number) {
    this.formData.publicCible?.splice(index, 1);
  }

  // ===================== SUBMIT =====================

  handleSubmit() {
    if (!this.formData.titre) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs obligatoires',
        timer: 2000,
        showConfirmButton: false
      });
      this.currentModalStep = 1;
      return;
    }

    if (this.modalMode === 'add' && !this.selectedImage) {
      Swal.fire({
        icon: 'warning',
        title: 'Image manquante',
        text: 'Veuillez sélectionner une image',
        timer: 2000,
        showConfirmButton: false
      });
      this.currentModalStep = 1;
      return;
    }

    if (!this.selectedPlateformeId) {
      Swal.fire({
        icon: 'warning',
        title: 'Plateforme manquante',
        text: 'Veuillez sélectionner une plateforme',
        timer: 2000,
        showConfirmButton: false
      });
      this.currentModalStep = 1;
      return;
    }

    this.updatePrix();

    const payload: Certification = {
      ...this.formData,
      competencesValidees: (this.formData.competencesValidees || []).filter(c => c && c.trim() !== ''),
      publicCible: (this.formData.publicCible || []).filter(p => p && p.trim() !== ''),
      avantages: (this.formData.avantages || []).filter(a => a.titre && a.titre.trim() !== '')
    };

    // Le backend reçoit la plateforme via l'URL (create) ou déjà associée (update)
    delete (payload as any).plateforme;
    delete (payload as any).avis;

    const request$ = this.modalMode === 'add'
      ? this.certificationService.create(payload, this.selectedPlateformeId, this.selectedImage || undefined)
      : this.certificationService.update(this.editId as number, payload, this.selectedImage || undefined);

    request$.subscribe({
      next: () => {
        this.closeModal();
        Swal.fire({
          title: 'Succès!',
          text: this.modalMode === 'add' ? 'Certification ajoutée avec succès' : 'Certification modifiée avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.fetchCertifications());
      },
      error: (error) => {
        console.error('Erreur lors de la soumission:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error?.error?.message || error?.message || 'Une erreur est survenue',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  formatCategory(category: string | undefined): string {
    if (!category) return 'Non renseignée';
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

    trackByIndex(index: number): number {
  return index;
}
}