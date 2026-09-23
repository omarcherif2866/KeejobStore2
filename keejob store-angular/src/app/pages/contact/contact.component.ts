import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';
// TODO: remplacez par votre service réel (ex: ContactService, HttpClient...)
// import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submitContactForm(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.errorMessage = 'Merci de remplir correctement tous les champs obligatoires.';
      return;
    }

    this.submitting = true;

const payload = {
  nom: this.contactForm.value.lastName,
  prenom: this.contactForm.value.firstName,
  email: this.contactForm.value.email,
  phone: this.contactForm.value.phone,
  sujet: this.contactForm.value.subject,
  message: this.contactForm.value.message
};


   this.contactService.sendContact(payload).subscribe({
    next: (res) => {
      console.log('succès:', res);
      Swal.fire({ icon: 'success', title: 'Message envoyé !', timer: 2000 });
      this.contactForm.reset();
    },
    error: (err) => {
      console.log('erreur:', err);
      Swal.fire({ icon: 'error', title: 'Erreur', text: err.message });
    }
  });

    // Simulation temporaire (à retirer une fois le service branché)
    setTimeout(() => {
      this.submitting = false;
      this.successMessage = 'Votre message a bien été envoyé. Nous vous répondrons sous 24h.';
      this.contactForm.reset();
    }, 800);
  }
}