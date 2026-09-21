import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceFormateur } from 'src/app/models/service-formateur';
import { TitleWhy } from 'src/app/models/title-why';
import { AuthService } from 'src/app/services/auth.service';
import { ServiceFormateurService } from 'src/app/services/service-formateur.service';
import { TitleWhyService } from 'src/app/services/title-why.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-formateur',
  templateUrl: './service-formateur.component.html',
  styleUrls: ['./service-formateur.component.css']
})
export class ServiceFormateurComponent implements OnInit {

  sidebarOpen = true;
  services: ServiceFormateur[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    title: '',
    description: ''
  };

  formDataTitleWhy = {
    id: null,
    title: '',
    description: ''
  };
  listTitleWhy: TitleWhy[] = [];
  savedTitleWhy: TitleWhy[] = [];

  currentUserId: number | null = null;
  formateurIdFromRoute: string | null = null;   // ← ajouté

  editId: any = null;
  selectedImage: File | null = null;
  isAdminOrSuper = false;
  userRole: string = '';
  isFormateur = false;

  constructor(
    private ServiceFormateur: ServiceFormateurService,
    private authService: AuthService,
    private router: Router,
    private titleWhyService: TitleWhyService,
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
    this.fetchservices();
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


fetchservices() {
  this.loading = true;

  const onSuccess = (response: any[]) => {
    this.services = response;
    this.loading = false;
  };
  const onError = (error: any) => {
    console.error('Erreur lors du chargement des services', error);
    this.loading = false;
  };

  // Formateur connecté → on passe par son user id
  if (this.isFormateur) {
    this.ServiceFormateur.getServicesByUser(this.currentUserId!).subscribe(onSuccess, onError);
    return;
  }

  // Admin avec un id formateur dans l'URL
  if (this.isAdminOrSuper && this.formateurIdFromRoute) {
    this.ServiceFormateur.getServicesByFormateur(this.formateurIdFromRoute).subscribe(onSuccess, onError);
    return;
  }

  // Admin sans id → tous les services
  if (this.isAdminOrSuper) {
    this.ServiceFormateur.getAll().subscribe(onSuccess, onError);
    return;
  }

  this.loading = false;
}

  get currentItems(): ServiceFormateur[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.services.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.services.length / this.itemsPerPage);
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
      description: ''
    };
    this.showModal = true;
  }

  addTitleWhy() {
    const why = new TitleWhy('', '');
    why.Id = null;
    why.Formateur = null;
    this.listTitleWhy.push(why);
  }

  removeTitleWhy(index: number) {
    this.listTitleWhy.splice(index, 1);
  }

  handleEdit(services: any) {
    console.log('Formation à éditer:', services);

    this.modalMode = 'edit';
    this.formData.id = services?.id || null;
    this.formData.title = services?.title || '';
    this.formData.description = services?.description || '';

    this.editId = services?.id || null;
    this.showModal = true;
  }

  handleSubmit() {
    const id = this.formateurIdFromRoute || localStorage.getItem("userId");   // ← modifié

    console.log("Formateur ID:", id);

    const serviceData = {
      title: this.formData.title,
      description: this.formData.description,
      formateur: { id: Number(id) }
    };

    console.log("Formation à envoyer:", serviceData);
    console.log("Mode:", this.modalMode);

    if (this.modalMode === 'add') {
      this.ServiceFormateur.add(serviceData).subscribe(
        (res) => {
          console.log('Formation ajoutée', res);
          Swal.fire({
            icon: 'success',
            title: 'Formation ajoutée',
            showConfirmButton: false,
            timer: 1500
          });
          this.showModal = false;
          this.fetchservices();
        },
        (err) => {
          console.error('Erreur ajout', err);
          console.error('Détails:', err.error);
        }
      );
    } else if (this.modalMode === 'edit') {
      this.ServiceFormateur.update(this.editId, serviceData).subscribe(
        (res) => {
          console.log('Formation modifiée', res);
          Swal.fire({
            icon: 'success',
            title: 'Formation modifiée',
            showConfirmButton: false,
            timer: 1500
          });
          this.showModal = false;
          this.fetchservices();
        },
        (err) => {
          console.error('Erreur modification', err);
          console.error('Détails:', err.error);
        }
      );
    }
  }

  saveTitleWhy(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const formateurId = this.formateurIdFromRoute || localStorage.getItem("userId");   // ← modifié

    this.listTitleWhy.forEach((why, index) => {
      const payload = {
        title: why.Title,
        description: why.Description,
        formateur: { id: Number(formateurId) }
      };

      this.titleWhyService.add(payload).subscribe(
        (res: any) => {
          console.log(`TitleWhy #${index + 1} enregistré :`, res);
          this.savedTitleWhy.push(res);
        },
        (err) => {
          console.error(`Erreur enregistrement TitleWhy #${index + 1} :`, err);
        }
      );
    });

    this.listTitleWhy = [];
    Swal.fire('Tous les TitleWhy ont été enregistrés !', '', 'success');
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
}