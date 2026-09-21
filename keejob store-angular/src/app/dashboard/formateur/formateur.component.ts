import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Formateur } from 'src/app/models/formateur';
import { AuthService } from 'src/app/services/auth.service';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formateur',
  templateUrl: './formateur.component.html',
  styleUrls: ['./formateur.component.css']
})
export class FormateurComponent implements OnInit {
  sidebarOpen = true;
  formateurs: Formateur[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
showPassword = false;

  formData = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    experience: '',
    poste: '',
    university: '',
    image:'',
    discount: null as number | null,   // ← ajouté
    formationPresentiel: false,
    formationEnLigne: false,
      password: ''            // ← ajouté


  };
  
  editId: any = null;
  selectedImage: File | null = null;
  isAdminOrSuper = false;
  userRole: string = '';
  currentUserId: number | null = null;   // ← ajouté
    isFormateur = false;

  constructor(private formateurservice: FormateurService, private authService: AuthService,private router:Router) {

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
    this.fetchFormateurs();
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

  // Récupérer les actualités depuis le backend
fetchFormateurs() {
  this.loading = true;
  this.formateurservice.getFormateur().subscribe(
    (response: any[]) => {
      this.formateurs = response.map(f => new Formateur(
        f.id,
        f.phone,
        f.description,
        f.address,
        f.email,
        f.experience,
        f.poste,
        f.firstName,
        f.lastName,
        f.university,
        f.image,
        f.discount,                    // ← ajouté, remis à la bonne position
        f.formationPresentiel ?? false,
        f.formationEnLigne ?? false,
        f.servicesFormateurs || [],
        f.titleWhyList || []
      ));
      this.loading = false;
      console.log('Données reçues: ', this.formateurs);
    },
    (error) => {
      console.error('Erreur lors du chargement des formateurs:', error);
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors du chargement des données',
        showConfirmButton: false,
        timer: 1500
      });
    }
  );
}


  // Pagination
  get currentItems(): Formateur[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.formateurs.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.formateurs.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

// Ajouter un formateur
handleAdd() {
  this.modalMode = 'add';
  this.formData = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    experience: '',
    poste: '',
    university: '',
    image: '',
    discount: null,
    formationPresentiel: false,
    formationEnLigne: false,
    password: ''

  };
  this.showModal = true;
}

// Éditer un formateur
handleEdit(formateur: Formateur) {
  this.modalMode = 'edit';
  this.formData = {
    id: formateur.Id,
    firstName: formateur.FirstName,
    lastName: formateur.LastName,
    email: formateur.Email,
    phone: formateur.Phone,
    address: formateur.Address,
    description: formateur.Description,
    experience: formateur.Experience,
    poste: formateur.Poste,
    university: formateur.University,
    image: formateur.Image,
    discount: formateur.Discount,
    formationPresentiel: formateur.FormationPresentiel ?? false,
    formationEnLigne: formateur.FormationEnLigne ?? false,
    password: ''


  };
  this.editId = formateur.Id;
  this.showModal = true;
}


  // Supprimer une actualité
  handleDelete(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      this.formateurservice.deleteFormateur(id).subscribe(
        () => {
          this.formateurs = this.formateurs.filter(item => item.Id !== id);
          Swal.fire({
            title: 'Success!',
            text: 'Actualité supprimée avec succès',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });         
        },
        (error) => {
          Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la suppression',
          showConfirmButton: false,
          timer: 1500
        });          
        }
      );
    }
  }

  // Soumettre le formulaire
handleSubmit() {
  if (this.modalMode === 'add' && this.formData.password && this.formData.password.length < 8) {
  alert('Le mot de passe doit contenir au moins 8 caractères');
  return;
}
  // Vérification des champs obligatoires
  if (
    !this.formData.firstName || !this.formData.lastName || !this.formData.email ||
    !this.formData.phone || !this.formData.address || !this.formData.description || 
    !this.formData.university || !this.formData.experience || !this.formData.poste 
  ) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Créer FormData pour envoyer les données + l'image
  const formData = new FormData();
  formData.append('firstName', this.formData.firstName);
  formData.append('lastName', this.formData.lastName);
  formData.append('email', this.formData.email);
  formData.append('phone', this.formData.phone);
  formData.append('address', this.formData.address);
  formData.append('university', this.formData.university);
  formData.append('experience', this.formData.experience);
  formData.append('description', this.formData.description);
  formData.append('poste', this.formData.poste);
  if (this.formData.discount !== null && this.formData.discount !== undefined) {
    formData.append('discount', this.formData.discount.toString());
  }  
  formData.append('formationPresentiel', String(this.formData.formationPresentiel));
  formData.append('formationEnLigne', String(this.formData.formationEnLigne));
  // Ajouter l'image si elle existe
  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

if (this.modalMode === 'add') {
  if (this.formData.password) {
    formData.append('password', this.formData.password);
  }
  for (const pair of (formData as any).entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
  this.formateurservice.addFormateur(formData).subscribe(
    (response: any) => {
      this.showModal = false;
      this.selectedImage = null;

      const password = response.temporaryPassword;   // null si le user existait déjà
      const email = response.formateur?.email;

      const html = password
        ? `Un compte a été créé pour <b>${email}</b>.<br><br>
           Mot de passe du compte :<br>
           <code style="font-size:1.2em; user-select:all">${password}</code><br><br>
           <small>Ce mot de passe ne sera plus affiché. Communiquez-le au formateur.</small>`
        : `Le formateur a été lié au compte existant <b>${email}</b>.`;

      Swal.fire({
        title: 'Formateur ajouté avec succès',
        html,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => this.fetchFormateurs());
    },
    (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors de l\'ajout',
        text: typeof error.error === 'string' ? error.error : (error.error?.message || 'Une erreur est survenue'),
        confirmButtonText: 'OK'
      });
    }
  );
} else {
  this.formateurservice.putFormateur(this.editId, formData).subscribe(
    () => {
      this.showModal = false;
      this.selectedImage = null;

      Swal.fire({
        title: 'Success!',
        text: 'Formateur modifié avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => this.fetchFormateurs());
    },
    (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors de la modification',
        text: typeof error.error === 'string' ? error.error : (error.error?.message || 'Une erreur est survenue'),
        confirmButtonText: 'OK'
      });
    }
  );
}
}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

getServicesTitles(formateur: any): string {
  if (!formateur.servicesFormateurs) return '';
  return formateur.servicesFormateurs.map(s => s.title).join(', ');
}

getTitleWhy(formateur: any): string {
  if (!formateur.titleWhy) return '';
  return formateur.titleWhy.map(s => s.title).join(', ');
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


onImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    // Vérifier le type de fichier
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
    
    // Vérifier la taille (par exemple, max 5MB)
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


sanitizeImage(url: string): string {
  if (!url) return '';

  // Cas où l'URL est en double
  if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
    const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
    return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
  }

  return url;
}


generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  this.formData.password = Array.from(values, v => chars[v % chars.length]).join('');
  this.showPassword = true;   // pour que l'admin voie ce qui a été généré
}

}