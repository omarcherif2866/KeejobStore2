export interface CaracteristiqueCentre {
  icone: string;        // ex: "shield", "users"
  titre: string;        // "Certifications reconnues"
  description: string;  // "Diplômes et certifications internationales"
}

export interface Formation {
  titre: string;   // "Développement Web Full Stack"
  duree: string;   // "6 mois"
  icone: string;
}

export interface CentreFormation {
  id?: number;
  nom: string;
  certifie: boolean;
  image: string;
  localisation: string;
  note: number;
  nombreAvis: number;
  description: string;

  // Contact
  telephone: string;
  email: string;
  siteWeb: string;
  adresse: string;

  // Statistiques
  nombreFormations: number;
  nombreFormateurs: number;
  nombreApprenants: number;
  tauxSatisfaction: number;

  apropos: string;

  // Anciennement InformationsPratiques (@Embedded côté backend) : champs aplatis
  horaires: string;              // "Lun - Ven : 8h30 - 17h30"
  languesEnseignement: string;   // "Français, Arabe, Anglais"
  modalites: string;             // "Présentiel, En ligne, Hybride"
  certifications: string;        // "Internationales et reconnues"

  domainesFormation: string[];
  caracteristiques: CaracteristiqueCentre[];
  formations: Formation[];
}