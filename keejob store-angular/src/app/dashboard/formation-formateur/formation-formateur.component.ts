import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationFormateur } from 'src/app/models/formation-formateur';
import { AuthService } from 'src/app/services/auth.service';
import { FormationFormateurService } from 'src/app/services/formation-formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formation-formateur',
  templateUrl: './formation-formateur.component.html',
  styleUrls: ['./formation-formateur.component.css']
})
export class FormationFormateurComponent implements OnInit {

  sidebarOpen = true;
  formations: FormationFormateur[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    title: '',
    description: [] as string[]
  };

  editId: any = null;
  selectedImage: File | null = null;
  isAdminOrSuper = false;
  userRole: string = '';
  currentUserId: number | null = null;
  formateurIdFromRoute: string | null = null;   // ← ajouté
  isFormateur = false;

  constructor(
    private formationFormateur: FormationFormateurService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute   // ← ajouté
  ) {
    
  }

  ngOnInit() {
  this.currentUserId = Number(localStorage.getItem('userId'));

  const role = (this.authService.getRoleFromToken() || '')
    .trim()
    .toUpperCase()
    .replace('ROLE_', '');

  this.userRole = role;
  this.isFormateur = role === 'FORMATEUR';
  this.isAdminOrSuper = ['ADMIN', 'SUPERADMIN'].includes(role);
  this.formateurIdFromRoute = this.route.snapshot.paramMap.get('id');   // ← ajouté
    this.fetchFormations();
  }


  // Retourne ['/formationFormateur', 12] ou ['/formationFormateur']
  get formationLink(): any[] {
    return this.isFormateur && this.currentUserId
      ? ['/formationFormateur', this.currentUserId]
      : ['/formationFormateur'];
  }

  get serviceLink(): any[] {
    return this.isFormateur && this.currentUserId
      ? ['/serviceFormateur', this.currentUserId]
      : ['/serviceFormateur'];
  }

fetchFormations() {
  this.loading = true;

  const onSuccess = (response: any[]) => {
    this.formations = response;
    this.loading = false;
  };
  const onError = (error: any) => {
    console.error('Erreur lors du chargement des formations', error);
    this.loading = false;
  };

  // Formateur connecté → via son user id
  if (this.isFormateur) {
    this.formationFormateur.getFormationsByUser(this.currentUserId!).subscribe(onSuccess, onError);
    return;
  }

  // Admin avec un id formateur dans l'URL
  if (this.isAdminOrSuper && this.formateurIdFromRoute) {
    this.formationFormateur.getByFormateur(this.formateurIdFromRoute).subscribe(onSuccess, onError);
    return;
  }

  // Admin sans id → toutes les formations
  if (this.isAdminOrSuper) {
    this.formationFormateur.getAll().subscribe(onSuccess, onError);
    return;
  }

  this.loading = false;
}

  // Pagination
  get currentItems(): FormationFormateur[] {
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

  handleAdd() {
    this.modalMode = 'add';
    this.formData = {
      id: null,
      title: '',
      description: ['']
    };
    this.showModal = true;
  }

  handleEdit(formations: any) {
    console.log('Formation à éditer:', formations);

    this.modalMode = 'edit';
    this.formData.id = formations?.id || null;
    this.formData.title = formations?.title || '';

    this.formData.description.length = 0;
    if (formations?.description) {
      if (Array.isArray(formations.description)) {
        this.formData.description.push(...formations.description);
      } else {
        this.formData.description.push(formations.description);
      }
    } else {
      this.formData.description.push('');
    }

    this.editId = formations?.id || null;
    this.showModal = true;
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  handleSubmit() {
    // Priorité à l'id de l'URL (Formateur), sinon localStorage
    const id = this.formateurIdFromRoute || localStorage.getItem("userId");

    console.log("Formateur ID:", id);

    const formationData = {
      title: this.formData.title,
      description: this.formData.description.filter(d => d.trim() !== ''),
      formateur: { id: Number(id) }
    };

    console.log("Formation à envoyer:", formationData);
    console.log("Mode:", this.modalMode);

    if (this.modalMode === 'add') {
      this.formationFormateur.add(formationData).subscribe(
        (res) => {
          console.log('Formation ajoutée', res);
          Swal.fire({
            icon: 'success',
            title: 'Formation ajoutée',
            showConfirmButton: false,
            timer: 1500
          });
          this.showModal = false;
          this.fetchFormations();
        },
        (err) => {
          console.error('Erreur ajout', err);
          console.error('Détails:', err.error);
        }
      );
    } else if (this.modalMode === 'edit') {
      this.formationFormateur.update(this.editId, formationData).subscribe(
        (res) => {
          console.log('Formation modifiée', res);
          Swal.fire({
            icon: 'success',
            title: 'Formation modifiée',
            showConfirmButton: false,
            timer: 1500
          });
          this.showModal = false;
          this.fetchFormations();
        },
        (err) => {
          console.error('Erreur modification', err);
          console.error('Détails:', err.error);
        }
      );
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getServicesTitles(formateur: any): string {
    if (!formateur.servicesFormateurs) return '';
    return formateur.servicesFormateurs.map((s: any) => s.title).join(', ');
  }

  getTitleWhy(formateur: any): string {
    if (!formateur.titleWhy) return '';
    return formateur.titleWhy.map((s: any) => s.title).join(', ');
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'error',
      title: 'Vous êtes deconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/']);
  }

  addDescription() {
    this.formData.description.push('');
  }

  removeDescription(index: number) {
    this.formData.description.splice(index, 1);
  }
}