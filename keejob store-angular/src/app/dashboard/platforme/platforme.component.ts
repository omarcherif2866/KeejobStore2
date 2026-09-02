import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
 
import { Plateforme } from 'src/app/models/platforme';
import { PlateformeService } from 'src/app/services/platforme.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-platforme',
  templateUrl: './platforme.component.html',
  styleUrls: ['./platforme.component.css']
})
export class PlatformeComponent implements OnInit {
 sidebarOpen = true;
  plateformes: Plateforme[] = [];
  loading = false;
 
  currentPage = 1;
  itemsPerPage = 5;
 
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentModalStep = 1;
  totalSteps = 3;
 
  editId: number | null = null;
  selectedLogo: File | null = null;
 
  formData: Plateforme = this.getEmptyPlateforme();
 
  constructor(
    private plateformeService: PlateformeService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}
 
  ngOnInit(): void {
    this.fetchPlateformes();
  }
 
  private getEmptyPlateforme(): Plateforme {
    return {
      nom: '',
      logo: '',
      populaire: false,
      note: 0,
      nombreAvis: '',
      nombreApprenants: '',
      description: '',
      siteWeb: '',
      // imageIllustration: '',
      categories: []
    };
  }
 
  // ===================== LISTE =====================
 
  fetchPlateformes() {
    this.loading = true;
    this.plateformeService.getAll().subscribe({
      next: (data: Plateforme[]) => {
        this.plateformes = [...data].sort((a, b) => (a.id || 0) - (b.id || 0));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plateformes:', error);
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
 
  get currentItems(): Plateforme[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.plateformes.slice(indexOfFirstItem, indexOfLastItem);
  }
 
  get totalPages(): number {
    return Math.ceil(this.plateformes.length / this.itemsPerPage);
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
    this.formData = this.getEmptyPlateforme();
    this.selectedLogo = null;
    this.editId = null;
    this.currentModalStep = 1;
    this.showModal = true;
  }
 
  handleEdit(plateforme: Plateforme) {
    this.modalMode = 'edit';
 
    this.formData = {
      ...this.getEmptyPlateforme(),
      ...plateforme,
      categories: plateforme.categories ? [...plateforme.categories] : []
    };
 
    this.editId = plateforme.id ?? null;
    this.selectedLogo = null;
 
    this.currentModalStep = 1;
    this.showModal = true;
  }
 
  closeModal() {
    this.showModal = false;
    this.formData = this.getEmptyPlateforme();
    this.selectedLogo = null;
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
        this.plateformeService.delete(id).subscribe({
          next: () => {
            this.plateformes = this.plateformes.filter(item => item.id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Plateforme supprimée avec succès',
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
      if (!this.formData.nom) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs manquants',
          text: 'Veuillez remplir le nom',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
    }
 
    if (this.currentModalStep === 2) {
      if (this.modalMode === 'add' && !this.selectedLogo) {
        Swal.fire({
          icon: 'warning',
          title: 'Logo manquant',
          text: 'Veuillez sélectionner un logo',
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
 
  // ===================== IMAGES =====================
 
  private validateImage(file: File, maxSizeMB: number): boolean {
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une image valide',
        timer: 1500,
        showConfirmButton: false
      });
      return false;
    }
 
    if (file.size > maxSizeMB * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `L'image ne doit pas dépasser ${maxSizeMB}MB`,
        timer: 1500,
        showConfirmButton: false
      });
      return false;
    }
 
    return true;
  }
 
  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!this.validateImage(file, 5)) return;
    this.selectedLogo = file;
  }
 
  sanitizeImage(url: string | null | undefined): string {
    if (!url) return '';
 
    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }
 
    return url;
  }
 
  // ===================== CATÉGORIES =====================
 
  addCategorie() {
    this.formData.categories = this.formData.categories || [];
    this.formData.categories.push('');
  }
 
  removeCategorie(index: number) {
    this.formData.categories?.splice(index, 1);
  }
 
  // ===================== SUBMIT =====================
 
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
 
    if (this.modalMode === 'add' && !this.selectedLogo) {
      Swal.fire({
        icon: 'warning',
        title: 'Logo manquant',
        text: 'Veuillez sélectionner un logo',
        timer: 2000,
        showConfirmButton: false
      });
      this.currentModalStep = 2;
      return;
    }
 
    const payload: Plateforme = {
      ...this.formData,
      categories: (this.formData.categories || []).filter(c => c && c.trim() !== '')
    };
 
    const request$ = this.modalMode === 'add'
      ? this.plateformeService.create(payload, this.selectedLogo || undefined)
      : this.plateformeService.update(this.editId as number, payload, this.selectedLogo || undefined);
 
    request$.subscribe({
      next: () => {
        this.closeModal();
        Swal.fire({
          title: 'Succès!',
          text: this.modalMode === 'add' ? 'Plateforme ajoutée avec succès' : 'Plateforme modifiée avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.fetchPlateformes());
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
}
 