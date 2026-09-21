import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: any = {};
  userId!: number;
  sidebarOpen = true;

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isAdminOrSuper = false;
  userRole: string = '';
  isFormateur = false;
  selectedImage: File | null = null;

  formData: any = {};
  formateurId: any = null;
  currentUserId: number | null = null;   // ← ajouté

  constructor(
    private userService: AuthService,
    private router: Router,
    private formateurService: FormateurService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
  this.currentUserId = Number(localStorage.getItem('userId'));

  const role = (this.userService.getRoleFromToken() || '')
    .trim()
    .toUpperCase()
    .replace('ROLE_', '');

  this.userRole = role;
  this.isFormateur = role === 'FORMATEUR';
  this.isAdminOrSuper = ['ADMIN', 'SUPERADMIN'].includes(role);

    this.userId = Number(this.route.snapshot.paramMap.get('id'));  // ← modifié, lit l'id depuis l'URL



    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        console.log("Utilisateur chargé :", this.user);
        if (this.isFormateur) {
          this.loadFormateurData();
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur chargement user',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
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

  loadUser() {
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        console.log("Utilisateur chargé :", this.user);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur chargement user',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  loadFormateurData() {
    this.formateurService.getFormateur().subscribe({
      next: (allFormateurs: any[]) => {
        // On cherche le formateur dont l'email correspond à l'utilisateur connecté
        const email = this.user?.email || localStorage.getItem('userEmail');

        const found = allFormateurs.find(f => f.email === this.user.email);

        if (found) {
          this.formateurId = found.id;
          this.formData = { ...found };
        } else {
          console.warn('Aucun profil formateur trouvé pour cet utilisateur');
        }
      },
      error: (err) => {
        console.error('Erreur chargement liste formateurs:', err);
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  handleSubmit(): void {
    if (!this.formateurId) {
      Swal.fire({ icon: 'error', title: 'Profil formateur introuvable' });
      return;
    }

    const formPayload = new FormData();
    formPayload.append('firstName', this.formData.firstName ?? '');
    formPayload.append('lastName', this.formData.lastName ?? '');
    formPayload.append('email', this.formData.email ?? '');
    formPayload.append('phone', this.formData.phone ?? '');
    formPayload.append('address', this.formData.address ?? '');
    formPayload.append('university', this.formData.university ?? '');
    formPayload.append('experience', this.formData.experience ?? '');
    formPayload.append('description', this.formData.description ?? '');
    formPayload.append('poste', this.formData.poste ?? '');
    formPayload.append('discount', this.formData.discount ?? '');
    formPayload.append('formationPresentiel', String(this.formData.formationPresentiel ?? false));
    formPayload.append('formationEnLigne', String(this.formData.formationEnLigne ?? false));

    if (this.selectedImage) {
      formPayload.append('image', this.selectedImage);
    }

    this.formateurService.putFormateur(this.formateurId, formPayload).subscribe({
      next: (updated) => {
        console.log('Profil formateur mis à jour:', updated);
        Swal.fire({
          title: 'Success!',
          text: 'Votre profil formateur a été modifié avec succès !',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 1500,
        });
      },
      error: (err) => {
        console.error('Erreur mise à jour formateur:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la modification',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  update() {
    this.userService.updateUser(this.userId, this.user).subscribe({
      next: (updatedUser) => {
        console.log("Profil mis à jour :", updatedUser);
        Swal.fire({
          title: 'Success!',
          text: 'Votre profil à été modifié avec succès !',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 1500,
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la modification',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  logout(): void {
    this.userService.logout();
    Swal.fire({
      icon: 'error',
      title: 'Vous êtes deconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/']);
  }

updatePassword() {
  if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Les mots de passe ne correspondent pas !'
    });
    return;
  }

  const body = {
    oldPassword: this.passwordData.oldPassword,
    newPassword: this.passwordData.newPassword
  };

  this.userService.changePassword(this.userId, body).subscribe(   // ← this.userId au lieu de localStorage
    (response: any) => {
      Swal.fire({
        title: 'Success!',
        text: response.message,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 1500,
      });
    },
    (error) => {
      console.error("Erreur API :", error);
      const message = error.error?.message || "Erreur lors de la mise à jour du mot de passe";
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message
      });
    }
  );
}
}