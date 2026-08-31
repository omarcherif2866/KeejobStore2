import { Plateforme } from "./platforme";



export enum FormationCategory {
  Formations_langues = 'Formations_langues',
  Formations_office = 'Formations_office',
  Formations_Design = 'Formations_Design',
  Formations_Digital = 'Formations_Digital',

}



export interface Avantage {
  titre: string;
}

export interface FormationKeejob {
  id?: number;

  titre: string;
  badge: string;
  image: string;                  // URL Cloudinary
  lienFormation: string;

  descriptionCourte: string;      // max 500 caractères
  aPropos: string;                // max 2000 caractères

  // note: number;
  // nombreAvis: number;
  nombreApprenants: string;

  niveau: string;
  duree: string;
  langue: string;
  sousTitres: string;
  acces: string;
  derniereMiseAJour: string;

  prix: number;
  prixOriginal: number;
  reduction: number;

  accesVie: boolean;
  certificatInclus: boolean;
  garantieRemboursement: string;

  categoryFormationKeejob: FormationCategory;

  avantages: Avantage[];
  competencesAcquises: string[];
  publicCible: string[];

  plateforme?: Plateforme | { id: number };

  // avis est marqué @JsonIgnore côté back → généralement non exposé
  // avis?: Avis[];
}
