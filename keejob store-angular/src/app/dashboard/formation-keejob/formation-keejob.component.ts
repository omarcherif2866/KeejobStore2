import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { FormationCategory, FormationKeejob } from 'src/app/models/formation-keejob';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
import { AuthService } from 'src/app/services/auth.service';
import { PlateformeService } from 'src/app/services/platforme.service';
// ⚠️ Adaptez le chemin/nom si votre service de plateformes est différent

@Component({
  selector: 'app-formation-keejob',
  templateUrl: './formation-keejob.component.html',
  styleUrls: ['./formation-keejob.component.css']
})
export class FormationKeejobComponent implements OnInit {
  sidebarOpen = true;
  formations: FormationKeejob[] = [];
  loading = false;

  currentPage = 1;
  itemsPerPage = 5;

  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentModalStep = 1;
  totalSteps = 5;

  formationCategoryEnum = FormationCategory;
  availableCategories = Object.values(FormationCategory);

  // ⚠️ typé "any" car le modèle Plateforme n'a pas été fourni : adaptez les champs utilisés (nom, id, ...)
  plateformes: any[] = [];
  loadingPlateformes = false;
  selectedPlateformeId: number | null = null;

  editId: number | null = null;
  selectedImage: File | null = null;

  formData: FormationKeejob = this.getEmptyFormation();

  constructor(
    private formationService: FormationKeejobService,
    private plateformeService: PlateformeService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchFormations();
    this.fetchPlateformes();
  }

  private getEmptyFormation(): FormationKeejob {
    return {
      titre: '',
      badge: '',
      image: '',
      lienFormation: '',
      descriptionCourte: '',
      aPropos: '',
      // note: 0,
      // nombreAvis: 0,
      nombreApprenants: '',
      niveau: '',
      duree: '',
      langue: '',
      sousTitres: '',
      acces: '',
      derniereMiseAJour: '',
      prix: 0,
      prixOriginal: 0,
      reduction: 0,
      accesVie: false,
      certificatInclus: false,
      garantieRemboursement: '',
      categoryFormationKeejob: FormationCategory.Formations_langues,
      avantages: [],
      competencesAcquises: [],
      publicCible: []
    };
  }

  // ===================== LISTE =====================

  fetchFormations() {
    this.loading = true;
    this.formationService.getAll().subscribe({
      next: (data: FormationKeejob[]) => {
        this.formations = [...data].sort((a, b) => (a.id || 0) - (b.id || 0));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des formations:', error);
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

  get currentItems(): FormationKeejob[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.formations.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.formations.length / this.itemsPerPage);
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
    this.formData = this.getEmptyFormation();
    this.selectedImage = null;
    this.selectedPlateformeId = null;
    this.editId = null;
    this.currentModalStep = 1;
    this.showModal = true;
    this.updatePrix();
  }

  handleEdit(formation: FormationKeejob) {
    this.modalMode = 'edit';

    this.formData = {
      ...this.getEmptyFormation(),
      ...formation,
      avantages: formation.avantages ? formation.avantages.map(a => ({ ...a })) : [],
      competencesAcquises: formation.competencesAcquises ? [...formation.competencesAcquises] : [],
      publicCible: formation.publicCible ? [...formation.publicCible] : []
    };

    this.editId = formation.id ?? null;
    this.selectedImage = null;

    const plateformeVal: any = formation.plateforme;
    this.selectedPlateformeId = plateformeVal?.id ?? null;

    this.currentModalStep = 1;
    this.showModal = true;
    this.updatePrix();
  }

  closeModal() {
    this.showModal = false;
    this.formData = this.getEmptyFormation();
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
        this.formationService.delete(id).subscribe({
          next: () => {
            this.formations = this.formations.filter(item => item.id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Formation supprimée avec succès',
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

  sanitizeImage(url: string | null): string {
    if (!url) return '';

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }

    return url;
  }

  // ===================== AVANTAGES =====================

  addAvantage() {
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
        this.formData.avantages.splice(index, 1);
      }
    });
  }

  countCompletedAvantages(): number {
    return this.formData.avantages.filter(a => a.titre && a.titre.trim() !== '').length;
  }

  // ===================== COMPÉTENCES / PUBLIC CIBLE =====================

  addCompetence() {
    this.formData.competencesAcquises.push('');
  }

  removeCompetence(index: number) {
    this.formData.competencesAcquises.splice(index, 1);
  }

  addPublicCible() {
    this.formData.publicCible.push('');
  }

  removePublicCible(index: number) {
    this.formData.publicCible.splice(index, 1);
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

    const payload: FormationKeejob = {
      ...this.formData,
      competencesAcquises: (this.formData.competencesAcquises || []).filter(c => c && c.trim() !== ''),
      publicCible: (this.formData.publicCible || []).filter(p => p && p.trim() !== ''),
      avantages: (this.formData.avantages || []).filter(a => a.titre && a.titre.trim() !== '')
    };

    // Le backend reçoit la plateforme via l'URL (create) ou déjà associée (update)
    delete (payload as any).plateforme;

const request$ = this.modalMode === 'add'
  ? this.formationService.create(payload, this.selectedPlateformeId, this.selectedImage || undefined)
  : this.formationService.update(this.editId as number, payload, this.selectedPlateformeId as number, this.selectedImage || undefined);
    request$.subscribe({
      next: () => {
        this.closeModal();
        Swal.fire({
          title: 'Succès!',
          text: this.modalMode === 'add' ? 'Formation ajoutée avec succès' : 'Formation modifiée avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.fetchFormations());
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

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}