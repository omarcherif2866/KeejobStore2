import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CaracteristiqueCentre, CentreFormation, Formation } from 'src/app/models/centre-formation';
import { AuthService } from 'src/app/services/auth.service';
import { CentreFormationService } from 'src/app/services/centre-formation.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centre',
  templateUrl: './centre.component.html',
  styleUrls: ['./centre.component.css']
})
export class CentreComponent implements OnInit {
  sidebarOpen = true;
  centres: CentreFormation[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  // ====== FORM DATA (Step 1 à 4 : champs "plats") ======
  formData = {
    id: null as any,
    nom: '',
    certifie: false,
    image: '' as string,
    localisation: '',
    note: 0,
    nombreAvis: 0,
    description: '',

    telephone: '',
    email: '',
    siteWeb: '',
    adresse: '',

    nombreFormations: 0,
    nombreFormateurs: 0,
    nombreApprenants: 0,
    tauxSatisfaction: 0,

    apropos: '',
    horaires: '',
    languesEnseignement: '',
    modalites: '',
    certifications: ''
  };

  editId: any = null;
  selectedImage: File | null = null;
  currentModalStep = 1;
  totalSteps = 6;

  // ====== Step 5 : listes dynamiques ======
  domainesFormation: string[] = [];
  nouveauDomaine = '';
  caracteristiques: CaracteristiqueCentre[] = [];

  // ====== Step 6 : formations proposées ======
  formations: Formation[] = [];

  // Suggestions d'icônes (mêmes principes que la galerie du CV, adaptées ici en saisie libre / chips)
  // iconesSuggerees: string[] = ['shield', 'users', 'star', 'award', 'book', 'clock', 'globe', 'target'];

  loadingIcons = false;
  availableIcons: string[] = [];

  constructor(
    private centreFormationService: CentreFormationService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private evaluationservice: EvaluationService, 
     
  ) {}

  ngOnInit() {
    this.fetchCentres();
    this.loadFormationIcons();
  }

  // ================= LISTE =================

  fetchCentres() {
    this.loading = true;
    this.centreFormationService.getAllCentres().subscribe({
      next: (response: CentreFormation[]) => {
        this.centres = response.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des centres de formation:', error);
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

  get currentItems(): CentreFormation[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.centres.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.centres.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  // ================= AJOUT / EDITION =================

  private initializeFormData() {
    this.formData = {
      id: null,
      nom: '',
      certifie: false,
      image: '',
      localisation: '',
      note: 0,
      nombreAvis: 0,
      description: '',

      telephone: '',
      email: '',
      siteWeb: '',
      adresse: '',

      nombreFormations: 0,
      nombreFormateurs: 0,
      nombreApprenants: 0,
      tauxSatisfaction: 0,

      apropos: '',
      horaires: '',
      languesEnseignement: '',
      modalites: '',
      certifications: ''
    };
  }

  handleAdd() {
    this.modalMode = 'add';
    this.initializeFormData();
    this.selectedImage = null;
    this.editId = null;
    this.domainesFormation = [];
    this.caracteristiques = [];
    this.formations = [];
    this.currentModalStep = 1;
    this.showModal = true;
  }

  handleEdit(centre: CentreFormation) {
    this.modalMode = 'edit';

    this.formData = {
      id: centre.id ?? null,
      nom: centre.nom || '',
      certifie: !!centre.certifie,
      image: centre.image || '',
      localisation: centre.localisation || '',
      note: centre.note ?? 0,
      nombreAvis: centre.nombreAvis ?? 0,
      description: centre.description || '',

      telephone: centre.telephone || '',
      email: centre.email || '',
      siteWeb: centre.siteWeb || '',
      adresse: centre.adresse || '',

      nombreFormations: centre.nombreFormations ?? 0,
      nombreFormateurs: centre.nombreFormateurs ?? 0,
      nombreApprenants: centre.nombreApprenants ?? 0,
      tauxSatisfaction: centre.tauxSatisfaction ?? 0,

      apropos: centre.apropos || '',
      horaires: centre.horaires || '',
      languesEnseignement: centre.languesEnseignement || '',
      modalites: centre.modalites || '',
      certifications: centre.certifications || ''
    };

    this.editId = centre.id ?? null;
    this.selectedImage = null;

    this.domainesFormation = centre.domainesFormation ? [...centre.domainesFormation] : [];
    this.caracteristiques = centre.caracteristiques
      ? centre.caracteristiques.map(c => ({ ...c }))
      : [];
    this.formations = centre.formations ? centre.formations.map(f => ({ ...f })) : [];

    this.currentModalStep = 1;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.initializeFormData();
    this.selectedImage = null;
    this.editId = null;
    this.domainesFormation = [];
    this.caracteristiques = [];
    this.formations = [];
    this.currentModalStep = 1;
  }

  handleDelete(id: any) {
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
        this.centreFormationService.deleteCentre(id).subscribe({
          next: () => {
            this.centres = this.centres.filter(item => item.id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Centre de formation supprimé avec succès',
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
              text: error.message || 'Une erreur est survenue',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

  // ================= DOMAINES DE FORMATION (Step 5) =================

  addDomaine() {
    const val = (this.nouveauDomaine || '').trim();
    if (val && !this.domainesFormation.includes(val)) {
      this.domainesFormation.push(val);
    }
    this.nouveauDomaine = '';
  }

  removeDomaine(index: number) {
    this.domainesFormation.splice(index, 1);
  }

  // ================= CARACTERISTIQUES (Step 5) =================

  addCaracteristique() {
    this.caracteristiques.push({ icone: '', titre: '', description: '' });
  }

  removeCaracteristique(index: number) {
    Swal.fire({
      title: 'Supprimer cette caractéristique?',
      text: "Cette action est irréversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#666',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.caracteristiques.splice(index, 1);
      }
    });
  }

  selectIconeCaracteristique(icone: string, item: CaracteristiqueCentre) {
    item.icone = icone;
  }

  // ================= FORMATIONS (Step 6) =================

  addFormation() {
    this.formations.push({ titre: '', duree: '', icone: '' });
  }

  removeFormation(index: number) {
    Swal.fire({
      title: 'Supprimer cette formation?',
      text: "Cette action est irréversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#666',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formations.splice(index, 1);
      }
    });
  }

  selectIconeFormation(icone: string, item: Formation) {
    item.icone = icone;
  }

  // ================= NAVIGATION STEPPER =================

  nextModalStep() {
    if (this.currentModalStep === 1) {
      if (!this.formData.nom) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs manquants',
          text: 'Veuillez remplir le nom du centre',
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

  // ================= UPLOAD IMAGE =================

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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
  }

  getImagePreview(): SafeUrl | string {
    if (this.selectedImage) {
      const url = URL.createObjectURL(this.selectedImage);
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return this.sanitizeImage(this.formData.image);
  }

  sanitizeImage(url: string | null): string {
    if (!url) return '';

    if (url.includes('https://res.cloudinary.com') && url.split('https://res.cloudinary.com').length > 2) {
      const parts = url.split('https://res.cloudinary.com/daxkymr4t/image/upload/');
      return 'https://res.cloudinary.com/daxkymr4t/image/upload/' + parts[parts.length - 1];
    }

    return url;
  }

  // ================= SOUMISSION =================

  handleSubmit() {
    if (!this.formData.nom) {
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

    const fd = new FormData();

    // Champs "plats"
    fd.append('nom', this.formData.nom);
    fd.append('certifie', String(this.formData.certifie));
    fd.append('localisation', this.formData.localisation);
    fd.append('note', String(this.formData.note));
    fd.append('nombreAvis', String(this.formData.nombreAvis));
    fd.append('description', this.formData.description);

    fd.append('telephone', this.formData.telephone);
    fd.append('email', this.formData.email);
    fd.append('siteWeb', this.formData.siteWeb);
    fd.append('adresse', this.formData.adresse);

    fd.append('nombreFormations', String(this.formData.nombreFormations));
    fd.append('nombreFormateurs', String(this.formData.nombreFormateurs));
    fd.append('nombreApprenants', String(this.formData.nombreApprenants));
    fd.append('tauxSatisfaction', String(this.formData.tauxSatisfaction));

    fd.append('apropos', this.formData.apropos);
    fd.append('horaires', this.formData.horaires);
    fd.append('languesEnseignement', this.formData.languesEnseignement);
    fd.append('modalites', this.formData.modalites);
    fd.append('certifications', this.formData.certifications);

    if (this.selectedImage) {
      fd.append('image', this.selectedImage, this.selectedImage.name);
    }

    // Listes -> JSON
    fd.append('domainesFormation', JSON.stringify(this.domainesFormation));
    fd.append('caracteristiques', JSON.stringify(this.caracteristiques));
    fd.append('formations', JSON.stringify(this.formations));

    const request$ = this.modalMode === 'add'
      ? this.centreFormationService.createCentre(fd)
      : this.centreFormationService.updateCentre(this.editId, fd);

    request$.subscribe({
      next: (response: CentreFormation) => {
        if (this.modalMode === 'add') {
          this.centres.push(response);
        } else {
          const index = this.centres.findIndex(item => item.id === this.editId);
          if (index !== -1) this.centres[index] = response;
        }

        this.closeModal();
        Swal.fire({
          title: 'Succès!',
          text: this.modalMode === 'add' ? 'Centre ajouté avec succès' : 'Centre modifié avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.fetchCentres());
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement du centre:', error);
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

  // ================= DIVERS =================

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

  countCompletedCaracteristiques(): number {
    return this.caracteristiques.filter(c => c.icone && c.titre).length;
  }

  countCompletedFormations(): number {
    return this.formations.filter(f => f.titre && f.duree).length;
  }

  loadFormationIcons() {
    this.loadingIcons = true;
    this.evaluationservice.getAvailableIconsFormation().subscribe({
      next: (icons) => {
        this.availableIcons = icons;
        this.loadingIcons = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des icônes de formation:', error);
        this.availableIcons = [];
        this.loadingIcons = false;
      }
    });
  }

  isIconSelected(iconUrl: string, item: Formation): boolean {
    return item.icone === iconUrl;
  }

  selectIconFromGallery(iconUrl: string, item: Formation) {
    item.icone = iconUrl;
  }


}