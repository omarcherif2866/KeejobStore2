import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PriceSection } from 'src/app/models/coaching';
import { Evaluation, EvaluationSection, Category, EvaluationCategory, Details } from 'src/app/models/evaluation';
import { EvaluationCatalogue } from 'src/app/models/evaluation-catalogue';
import { AuthService } from 'src/app/services/auth.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
 sidebarOpen = true;
  evaluations: Evaluation[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
 
  evaluationCategoryEnum = EvaluationCategory;
  availableEvaluationCategories = Object.values(EvaluationCategory);
 
  formData = {
    id: null as any,
    name: '',
    description: '',
    image: '',
    logo: '',
    evaluationCategory: null as EvaluationCategory | null
  };
 
  editId: any = null;
  selectedImage: File | null = null;
  selectedLogo?: File;
  currentModalStep: number = 1;
  sections: EvaluationSection[] = [];
 
  priceSections: PriceSection[] = [];
 
  availableIcons: string[] = [];
  availablePriceIcons: string[] = [];
  loadingIcons = false;
  loadingPriceIcons = false;
 catalogues: { title: string; image: File | string | null }[] = [];

  constructor(
    private evaluationService: EvaluationService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}
 
  ngOnInit() {
    this.fetchEvaluations();
    this.fetchAvailableIcons();
    this.fetchAvailablePriceIcons();
  }
 
  private initializeSections() {
    this.sections = [
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] }
    ];
  }
 
  private initializePriceSections() {
    this.priceSections = [
      {
        title: '',
        subtitle: '',
        price: 0,
        details: []
      }
    ];
  }
 
  fetchEvaluations() {
    this.loading = true;
    this.evaluationService.getEvaluation().subscribe({
      next: (response: any[]) => {
        this.evaluations = response
          .map(data => new Evaluation(data))
          .sort((a, b) => a.Id - b.Id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des évaluations:', error);
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
 
  get currentItems(): Evaluation[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.evaluations.slice(indexOfFirstItem, indexOfLastItem);
  }
 
  get totalPages(): number {
    return Math.ceil(this.evaluations.length / this.itemsPerPage);
  }
 
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
 
  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }
 
  handleAdd() {
    this.modalMode = 'add';
    this.formData = {
      id: null,
      name: '',
      description: '',
      image: '',
      logo: '',
      evaluationCategory: null
    };
    this.selectedImage = null;
    this.selectedLogo = undefined;
    this.initializeSections();
    this.initializePriceSections();
    this.initializeCatalogues();
    this.currentModalStep = 1;
    this.showModal = true;
  }
 
  handleEdit(ev: Evaluation) {
    this.modalMode = 'edit';
 
    this.formData = {
      id: ev.Id,
      name: ev.Name || '',
      description: ev.Description || '',
      image: ev.Image || '',
      logo: ev.Logo || '',
      evaluationCategory: ev.Category || null
    };
 
    this.editId = ev.Id;
    this.selectedImage = null;
    this.selectedLogo = undefined;
 
    if (ev.Sections && ev.Sections.length > 0) {
      const rawSections = ev.Sections;
      const indicesToKeep = [0, 1, 2];
 
      this.sections = indicesToKeep.map(idx => {
        const section = rawSections[idx];
        if (!section) {
          return { headline: '', subtitle: '', details: [] };
        }
        return {
          headline: section.headline || '',
          subtitle: section.subtitle || '',
          details: (section.details || []).map(detail => ({
            titre: detail.titre || '',
            description: detail.description || '',
            icon: detail.icon || null,
            category: detail.category || null
          }))
        };
      });
    } else {
      this.initializeSections();
    }
 
    if (ev.PriceSection && ev.PriceSection.length > 0) {
      this.priceSections = [...ev.PriceSection];
    } else {
      this.initializePriceSections();
    }

    if (ev.Catalogues && ev.Catalogues.length > 0) {
  this.catalogues = ev.Catalogues.map(c => ({
    title: (c as any).Title ?? (c as any).title ?? '',
    image: (c as any).Image ?? (c as any).image ?? null
  }));
} else {
  this.initializeCatalogues();
}

    this.currentModalStep = 1;
    this.showModal = true;
  }
 
  closeModal() {
    this.showModal = false;
    this.formData = {
      id: null,
      name: '',
      description: '',
      image: '',
      logo: '',
      evaluationCategory: null
    };
    this.selectedImage = null;
    this.selectedLogo = undefined;
    this.editId = null;
    this.sections = [];
    this.priceSections = [];
    this.currentModalStep = 1;
    this.catalogues = [];
  }
 
  handleDelete(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.evaluationService.deleteEvaluation(id).subscribe({
          next: () => {
            this.evaluations = this.evaluations.filter(item => item.Id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Évaluation supprimée avec succès',
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
 
  addDetailToSection(sectionIndex: number) {
    if (this.sections[sectionIndex]) {
      this.sections[sectionIndex].details.push({
        titre: '',
        description: '',
        icon: null,
        category: null
      });
    }
  }
 
  removeDetailFromSection(sectionIndex: number, detailIndex: number) {
    if (this.sections[sectionIndex] && this.sections[sectionIndex].details[detailIndex]) {
      Swal.fire({
        title: 'Supprimer ce détail?',
        text: 'Cette action est irréversible',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336',
        cancelButtonColor: '#666',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.sections[sectionIndex].details.splice(detailIndex, 1);
        }
      });
    }
  }
 
  addPriceSection() {
    this.priceSections.push({
      title: '',
      subtitle: '',
      price: 0,
      details: []
    });
  }
 
  removePriceSection(index: number) {
    Swal.fire({
      title: 'Supprimer ce pack?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#666',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.priceSections.splice(index, 1);
      }
    });
  }
 
  addDetailToPriceSection(priceSectionIndex: number) {
    if (this.priceSections[priceSectionIndex]) {
      this.priceSections[priceSectionIndex].details.push({
        titre: '',
        description: '',
        icon: ''
      });
    }
  }
 
  removeDetailFromPriceSection(priceSectionIndex: number, detailIndex: number) {
    if (
      this.priceSections[priceSectionIndex] &&
      this.priceSections[priceSectionIndex].details[detailIndex]
    ) {
      Swal.fire({
        title: 'Supprimer cette fonctionnalité?',
        text: 'Cette action est irréversible',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336',
        cancelButtonColor: '#666',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.priceSections[priceSectionIndex].details.splice(detailIndex, 1);
        }
      });
    }
  }
 
  handleSubmit() {
    if (!this.formData.name) {
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
 
    if (!this.formData.evaluationCategory) {
      Swal.fire({
        icon: 'warning',
        title: 'Catégorie manquante',
        text: "Veuillez sélectionner une catégorie d'évaluation",
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
 
    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('description', this.formData.description);
    formData.append('evaluationCategory', this.formData.evaluationCategory!);
 
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }
 
    if (this.selectedLogo) {
      formData.append('logo', this.selectedLogo, this.selectedLogo.name);
    }
 
    // ====== SECTIONS ======
    const iconFiles: (File | null)[] = [];
 
    this.sections.forEach(section => {
      (section.details || []).forEach(detail => {
        if (detail.icon && typeof detail.icon !== 'string' && detail.icon instanceof File) {
          iconFiles.push(detail.icon);
        } else {
          iconFiles.push(null);
        }
      });
    });
 
    const safeSections = this.sections.map(s => ({
      headline: s.headline || '',
      subtitle: s.subtitle || '',
      details: (s.details || []).map(d => ({
        titre: d.titre || '',
        description: d.description || '',
        icon: typeof d.icon === 'string' ? d.icon : '',
        category: d.category || null
      }))
    }));
    formData.append('sections', JSON.stringify(safeSections));
 
    iconFiles.forEach(iconFile => {
      if (iconFile instanceof File) {
        formData.append('iconFiles', iconFile, iconFile.name);
      } else {
        const emptyBlob = new Blob([], { type: 'application/octet-stream' });
        formData.append('iconFiles', emptyBlob, '');
      }
    });
 
    // ====== PRICE SECTIONS ======
    const priceIconFiles: (File | null)[] = [];
 
    this.priceSections.forEach(priceSection => {
      (priceSection.details || []).forEach(detail => {
        if (detail.icon && typeof detail.icon !== 'string' && detail.icon instanceof File) {
          priceIconFiles.push(detail.icon);
        } else {
          priceIconFiles.push(null);
        }
      });
    });
 
    const safePriceSections = this.priceSections.map(ps => ({
      title: ps.title || '',
      subtitle: ps.subtitle || '',
      price: ps.price || 0,
      details: (ps.details || []).map(d => ({
        titre: d.titre || '',
        description: d.description || '',
        icon: typeof d.icon === 'string' ? d.icon : ''
      }))
    }));
    formData.append('priceSections', JSON.stringify(safePriceSections));
 
    priceIconFiles.forEach(iconFile => {
      if (iconFile instanceof File) {
        formData.append('priceIconFiles', iconFile, iconFile.name);
      } else {
        const emptyBlob = new Blob([], { type: 'application/octet-stream' });
        formData.append('priceIconFiles', emptyBlob, '');
      }
    });
 this.catalogues.forEach(cat => {
  formData.append('catalogueTitles', cat.title || '');
});

this.catalogues.forEach(cat => {
  if (cat.image instanceof File) {
    formData.append('catalogueImages', cat.image, cat.image.name);
    formData.append('catalogueExistingImages', '');
  } else {
    const emptyBlob = new Blob([], { type: 'application/octet-stream' });
    formData.append('catalogueImages', emptyBlob, '');
    formData.append('catalogueExistingImages', typeof cat.image === 'string' ? cat.image : '');
  }
});
    const request$ =
      this.modalMode === 'add'
        ? this.evaluationService.addEvaluation(formData)
        : this.evaluationService.putEvaluation(this.editId, formData);
 
    request$.subscribe({
      next: (response: any) => {
        const newEv = new Evaluation(response);
 
        if (this.modalMode === 'add') {
          this.evaluations.push(newEv);
        } else {
          const index = this.evaluations.findIndex(item => item.Id === this.editId);
          if (index !== -1) this.evaluations[index] = newEv;
        }
 
        this.closeModal();
        Swal.fire({
          title: 'Succès!',
          text:
            this.modalMode === 'add'
              ? 'Évaluation ajoutée avec succès'
              : 'Évaluation modifiée avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.fetchEvaluations());
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
 
  onLogoSelected(event: any) {
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
 
      this.selectedLogo = file;
    }
  }
 
  onIconSelected(event: any, detail: Details) {
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
        event.target.value = '';
        return;
      }
 
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "L'icône ne doit pas dépasser 2MB",
          timer: 1500,
          showConfirmButton: false
        });
        event.target.value = '';
        return;
      }
 
      detail.icon = file;
    }
  }
 
  removeIcon(detail: Details) {
    detail.icon = null;
  }
 
  isImageIcon(icon: any): boolean {
    return icon instanceof File || (typeof icon === 'string' && icon.startsWith('http'));
  }
 
  getIconPreview(icon: any): SafeUrl | string {
    if (!icon) return '';
 
    if (icon instanceof File) {
      const url = URL.createObjectURL(icon);
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
 
    if (typeof icon === 'string' && icon.startsWith('http')) {
      return icon;
    }
 
    return '';
  }
 
  sanitizeImage(url: string | null): string {
    if (!url) return '';
 
    if (url.includes('https://res.cloudinary.com') && url.split('https://res.cloudinary.com').length > 2) {
      const parts = url.split('https://res.cloudinary.com/daxkymr4t/image/upload/');
      return 'https://res.cloudinary.com/daxkymr4t/image/upload/' + parts[parts.length - 1];
    }
 
    return url;
  }
 
  nextModalStep() {
    if (this.currentModalStep === 1) {
      if (!this.formData.name) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs manquants',
          text: 'Veuillez remplir le nom',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
 
      if (!this.formData.evaluationCategory) {
        Swal.fire({
          icon: 'warning',
          title: 'Catégorie manquante',
          text: 'Veuillez sélectionner une catégorie',
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
 
    if (this.currentModalStep < 6) {
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
 
  countCompletedSections(): number {
    return this.sections.filter((s, index) => {
      const headlineOk = index === 1 ? true : !!s.headline;
      if (!headlineOk || s.details.length === 0) {
        return false;
      }
      return s.details.every(d => d.titre && d.icon);
    }).length;
  }
 
  countCompletedPriceSections(): number {
    return this.priceSections.filter((ps) => {
      return ps.title && ps.price;
    }).length;
  }
 
  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
 
  fetchAvailableIcons() {
    this.loadingIcons = true;
 
    this.evaluationService.getAvailableIcons().subscribe({
      next: (icons: string[]) => {
        this.availableIcons = icons;
        this.loadingIcons = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des icônes:', error);
        this.loadingIcons = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les icônes disponibles',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
 
  selectIconFromGallery(iconUrl: string, detail: Details) {
    detail.icon = iconUrl;
  }
 
  isIconSelected(iconUrl: string, detail: Details): boolean {
    return detail.icon === iconUrl;
  }
 
  fetchAvailablePriceIcons() {
    this.loadingPriceIcons = true;
 
    this.evaluationService.getAvailablePriceIcons().subscribe({
      next: (icons: string[]) => {
        this.availablePriceIcons = icons;
        this.loadingPriceIcons = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des icônes de prix:', error);
        this.loadingPriceIcons = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les icônes de prix disponibles',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
 
  selectPriceIconFromGallery(iconUrl: string, detail: Details) {
    detail.icon = iconUrl;
  }

private initializeCatalogues() {
  this.catalogues = [];
}

addCatalogueItem() {
  this.catalogues.push({ title: '', image: null });
}

removeCatalogueItem(index: number) {
  Swal.fire({
    title: 'Supprimer ce catalogue?',
    text: 'Cette action est irréversible',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f44336',
    cancelButtonColor: '#666',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.catalogues.splice(index, 1);
    }
  });
}

onCatalogueImageSelected(event: any, catalogue: { title: string; image: File | string | null }) {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Veuillez sélectionner une image valide', timer: 1500, showConfirmButton: false });
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: "L'image ne doit pas dépasser 5MB", timer: 1500, showConfirmButton: false });
      event.target.value = '';
      return;
    }
    catalogue.image = file;
  }
}

removeCatalogueImage(catalogue: { title: string; image: File | string | null }) {
  catalogue.image = null;
}

}
 