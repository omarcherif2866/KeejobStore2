import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Cv, CVCategory, CvSection, Details, PriceSection } from 'src/app/models/cv';
import { Partenaire } from 'src/app/models/partenaire';
import { AuthService } from 'src/app/services/auth.service';
import { CvService } from 'src/app/services/cv.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {
  sidebarOpen = true;
  cvs: Cv[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  cvCategoryEnum = CVCategory;
  availableCVCategories = Object.values(CVCategory);

  formData = {
    id: null as any,
    name: '',
    description: '',
    image: '',
    // logo: '',
    categoryCV: null as CVCategory | null  // NOUVEAU
  };
  
  editId: any = null;
  selectedImage: File | null = null;
  currentModalStep: number = 1;
  sections: CvSection[] = [];
  selectedLogo?: File;

  // NOUVEAU : Gestion des PriceSections
  priceSections: PriceSection[] = [];
  
  // Partenaires
  // allPartenaires: Partenaire[] = [];
  // selectedPartenaires: Partenaire[] = [];
  availableIcons: string[] = [];
  availablePriceIcons: string[] = []; // ✅ NOUVEAU
  loadingIcons = false;
  loadingPriceIcons = false; // ✅ NOUVEAU

  constructor(
    private cvservice: CvService, 
    private evaluationservice: EvaluationService, 
    private partenaireService: PartenaireService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer  // ✅ AJOUTER CECI
    
  ) {}

  ngOnInit() {
    this.fetchcvs();
    // this.fetchPartenaires();
    this.fetchAvailableIcons(); // ← AJOUTER CECI
    this.fetchAvailablePriceIcons(); // ✅ NOUVEAU

  }

  // fetchPartenaires() {
  //   this.loading = true;
  //   console.log('📡 Récupération des partenaires...');
    
  //   this.partenaireService.getPartenaire().subscribe(
  //     (response: any[]) => {
  //       console.log('✅ Réponse partenaires:', response);
        
  //       this.allPartenaires = response.map(p => new Partenaire(
  //         p.id,
  //         p.title,
  //         p.description,
  //         p.image
  //       ));
        
  //       this.loading = false;
  //     },
  //     (error) => {
  //       console.error('❌ Erreur lors du chargement des partenaires:', error);
  //       this.loading = false;
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Erreur lors du chargement des partenaires',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
  //     }
  //   );
  // }

private initializeSections() {
  // 3 sections : Section 1, Section 2, Section 3 (ex-Section 5)
  this.sections = [
    { headline: '', subtitle: '', details: [] },
    { headline: '', subtitle: '', details: [] },
    { headline: '', subtitle: '', details: [] }
  ];
}

  // NOUVEAU : Initialiser les priceSections
  private initializePriceSections() {
    this.priceSections = [
      {
        title: '',
        subtitle: '',
        price: '',
        details: []
      }
    ];
  }

  fetchcvs() {
    this.loading = true;
    this.cvservice.getCv().subscribe({
      next: (response: any[]) => {
        this.cvs = response.map(data => new Cv(data));
        this.loading = false;
        console.log('Données reçues: ', this.cvs);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des CV:', error);
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

  get currentItems(): Cv[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.cvs.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.cvs.length / this.itemsPerPage);
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
      // logo: '',
      categoryCV: null  // NOUVEAU
    };
    this.selectedImage = null;
    this.initializeSections();
    this.initializePriceSections(); // NOUVEAU
    // this.selectedPartenaires = [];
    this.currentModalStep = 1;
    this.showModal = true;
  }

handleEdit(cv: Cv) {
  this.modalMode = 'edit';
  
  this.formData = {
    id: cv.Id,
    name: cv.Name || '',
    description: cv.Description || '',
    image: cv.Image || '',
    categoryCV: cv.Category || null
  };
  
  this.editId = cv.Id;
  this.selectedImage = null;
  
  if (cv.Sections && cv.Sections.length > 0) {
    // ✅ On ne garde que Section 1 (index 0), Section 2 (index 1)
    // et l'ancienne Section 5 (index 4), qui devient notre "Section 3"
    const indicesToKeep = [0, 1, 4];
    const rawSections = cv.Sections;

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
        }))
      };
    });
  } else {
    this.initializeSections();
  }

  // NOUVEAU : Charger les priceSections
  if (cv.PriceSection && cv.PriceSection.length > 0) {
    this.priceSections = [...cv.PriceSection];
  } else {
    this.initializePriceSections();
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
      // logo: '',
      categoryCV: null  // NOUVEAU
    };
    this.selectedImage = null;
    this.editId = null;
    this.sections = [];
    this.priceSections = []; // NOUVEAU
    // this.selectedPartenaires = [];
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
        this.cvservice.deleteCv(id).subscribe({
          next: () => {
            this.cvs = this.cvs.filter(item => item.Id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'CV supprimé avec succès',
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
      icon: null,  // ← CHANGÉ DE '' à null
    });
  }
}

  removeDetailFromSection(sectionIndex: number, detailIndex: number) {
    if (this.sections[sectionIndex] && this.sections[sectionIndex].details[detailIndex]) {
      Swal.fire({
        title: 'Supprimer ce détail?',
        text: "Cette action est irréversible",
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

  // NOUVEAU : Méthodes pour gérer les PriceSections
  addPriceSection() {
    this.priceSections.push({
      title: '',
      subtitle: '',
      price: '',
      details: []
    });
  }

  removePriceSection(index: number) {
    Swal.fire({
      title: 'Supprimer ce pack?',
      text: "Cette action est irréversible",
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
    if (this.priceSections[priceSectionIndex] && 
        this.priceSections[priceSectionIndex].details[detailIndex]) {
      Swal.fire({
        title: 'Supprimer cette fonctionnalité?',
        text: "Cette action est irréversible",
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

  // togglePartenaireSelection(partenaire: Partenaire) {
  //   const index = this.selectedPartenaires.findIndex(p => p.Id === partenaire.Id);
  //   if (index > -1) {
  //     this.selectedPartenaires.splice(index, 1);
  //   } else {
  //     this.selectedPartenaires.push(partenaire);
  //   }
  // }

  // isPartenaireSelected(partenaire: Partenaire): boolean {
  //   return this.selectedPartenaires.some(p => p.Id === partenaire.Id);
  // }

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
  formData.append('categoryCV', this.formData.categoryCV!);

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

  // ====== PRICE SECTIONS (AVEC GESTION DES ICÔNES) ======
  const priceIconFiles: (File | null)[] = [];
  
  // Collecter les fichiers d'icônes des priceSections
  this.priceSections.forEach(priceSection => {
    (priceSection.details || []).forEach(detail => {
      if (detail.icon && typeof detail.icon !== 'string' && detail.icon instanceof File) {
        priceIconFiles.push(detail.icon);
      } else {
        priceIconFiles.push(null);
      }
    });
  });

  // Créer safePriceSections sans les fichiers
  const safePriceSections = this.priceSections.map(ps => ({
    title: ps.title || '',
    subtitle: ps.subtitle || '',
    price: ps.price || '',
    details: (ps.details || []).map(d => ({
      titre: d.titre || '',
      description: d.description || '',
      icon: typeof d.icon === 'string' ? d.icon : '', // ✅ Seulement les URLs, pas les objets File
    }))
  }));
  
  console.log('💰 safePriceSections (DOIT avoir title):', JSON.stringify(safePriceSections, null, 2));
  formData.append('priceSections', JSON.stringify(safePriceSections));

  // Ajouter les fichiers d'icônes des priceSections
  priceIconFiles.forEach(iconFile => {
    if (iconFile instanceof File) {
      formData.append('priceIconFiles', iconFile, iconFile.name);
    } else {
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      formData.append('priceIconFiles', emptyBlob, '');
    }
  });

  // 🔍 LOG: Afficher TOUT le FormData
  console.log('📤 === CONTENU COMPLET DU FORMDATA ===');
  formData.forEach((value, key) => {
    if (key === 'sections' || key === 'priceSections') {
      console.log(`  ✅ ${key}:`, JSON.parse(value as string));
    } else {
      console.log(`  ✅ ${key}:`, value);
    }
  });

  // Partenaires
  // (this.selectedPartenaires || []).forEach(p => {
  //   if (p?.Id != null) formData.append('partenairesIds', p.Id.toString());
  // });

  const request$ = this.modalMode === 'add' 
    ? this.cvservice.addCv(formData) 
    : this.cvservice.putCv(this.editId, formData);

  request$.subscribe({
    next: (response: any) => {
      console.log('✅ Réponse backend:', response);
      
      const newCv = new Cv({
        id: response.id,
        name: response.name,
        description: response.description,
        image: response.image,
        logo: response.logo,
        categoryCV: response.categoryCV || null,
        sections: response.sections || [],
        priceSection: response.priceSections || [],
        evaluationPartenaires: response.cvPartenaires || []
      });

      if (this.modalMode === 'add') {
        this.cvs.push(newCv);
      } else {
        const index = this.cvs.findIndex(item => item.Id === this.editId);
        if (index !== -1) this.cvs[index] = newCv;
      }

      this.closeModal();
      Swal.fire({
        title: 'Succès!',
        text: this.modalMode === 'add' ? 'CV ajouté avec succès' : 'CV modifié avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => this.fetchcvs());
    },
    error: (error) => {
      console.error('❌ === ERREUR DÉTAILLÉE ===');
      console.error('❌ Error object:', error);
      console.error('❌ Error message:', error?.error?.message || error?.message);
      console.error('❌ Error status:', error?.status);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      
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
          text: 'L\'image ne doit pas dépasser 5MB',
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
          text: 'L\'image ne doit pas dépasser 5MB',
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
    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une image valide',
        timer: 1500,
        showConfirmButton: false
      });
      event.target.value = ''; // Reset input
      return;
    }
    
    // Validation de la taille (max 2MB pour les icônes)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'L\'icône ne doit pas dépasser 2MB',
        timer: 1500,
        showConfirmButton: false
      });
      event.target.value = ''; // Reset input
      return;
    }
    
    // Stocker le fichier dans detail.icon
    detail.icon = file;
  }
}

removeIcon(detail: Details) {
  detail.icon = null;
}

// Fonction pour vérifier si l'icône est une image
isImageIcon(icon: any): boolean {
  return icon instanceof File || (typeof icon === 'string' && icon.startsWith('http'));
}

// Fonction pour obtenir l'aperçu de l'icône
getIconPreview(icon: any): SafeUrl | string {
  if (!icon) return '';
  
  if (icon instanceof File) {
    const url = URL.createObjectURL(icon);
    return this.sanitizer.bypassSecurityTrustUrl(url);  // ✅ SANITIZE
  }
  
  if (typeof icon === 'string' && icon.startsWith('http')) {
    return icon;
  }
  
  return '';
}

  sanitizeImage(url: string | null): string {
    if (!url) return '';

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
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

  if (this.currentModalStep < 5) {
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
    return this.sections.filter((s) => {
      if (!s.headline || s.details.length === 0) {
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
  console.log('📡 Récupération des icônes disponibles...');
  
  this.evaluationservice.getAvailableIcons().subscribe({
    next: (icons: string[]) => {
      this.availableIcons = icons;
      this.loadingIcons = false;
      
      // 🔍 LOGS DE DEBUG DÉTAILLÉS
      console.log('✅ Réponse brute reçue du backend:', icons);
      console.log('📊 Type de la réponse:', typeof icons);
      console.log('📊 Est un tableau ?', Array.isArray(icons));
      console.log('📊 Nombre d\'icônes:', icons?.length ?? 'undefined/null');
      
      if (icons && icons.length > 0) {
        console.log('🖼️ Première icône (exemple d\'URL complète):', icons[0]);
        console.log('🖼️ Toutes les URLs:', JSON.stringify(icons, null, 2));
      } else {
        console.warn('⚠️ Le tableau d\'icônes est vide ou undefined !');
      }
    },
    error: (error) => {
      console.error('❌ Erreur lors du chargement des icônes:', error);
      console.error('❌ Status HTTP:', error.status);
      console.error('❌ Message d\'erreur complet:', error.error);
      console.error('❌ URL appelée:', error.url);
      
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

  // ✅ NOUVELLE MÉTHODE: Sélectionner une icône depuis la galerie
  selectIconFromGallery(iconUrl: string, detail: Details) {
    detail.icon = iconUrl;
    console.log('✅ Icône sélectionnée:', iconUrl);
  }

  // ✅ NOUVELLE MÉTHODE: Vérifier si une icône est déjà sélectionnée
  isIconSelected(iconUrl: string, detail: Details): boolean {
    return detail.icon === iconUrl;
  }


    fetchAvailablePriceIcons() {
    this.loadingPriceIcons = true;
    console.log('📡 Récupération des icônes de prix disponibles...');
    
    this.evaluationservice.getAvailablePriceIcons().subscribe({
      next: (icons: string[]) => {
        this.availablePriceIcons = icons;
        this.loadingPriceIcons = false;
        console.log('✅ Icônes de prix disponibles:', this.availablePriceIcons.length, icons);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des icônes de prix:', error);
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
    console.log('✅ Icône de prix sélectionnée:', iconUrl);
  }


}