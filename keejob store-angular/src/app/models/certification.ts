import { Avis } from './avis';
import { Plateforme } from './platforme';

export enum CategoryCertification {
  Marketing_Digital = 'Marketing_Digital',
  Entrepreneuriat = 'Entrepreneuriat',
  Langues = 'Langues'
}

export interface CertificationAvantage {
  titre: string;
}

export interface Certification {
  id?: number;

  titre: string;
  badge?: string;
  image?: string;                    // URL Cloudinary
  organismeEmetteur?: string;        // "Google", "HubSpot Academy"...
  lienCertification?: string;

  descriptionCourte?: string;
  aPropos?: string;

  // note?: number;
  // nombreAvis?: number;
  nombreCertifies?: string;          // "50 000+"

  niveau?: string;
  dureeExamen?: string;              // "1h30"
  dureeValidite?: string;            // "Valide à vie", "3 ans"
  langue?: string;
  modaliteExamen?: string;           // "En ligne, surveillé"
  derniereMiseAJour?: string;

  prix?: number;
  prixOriginal?: number;
  reduction?: number;

  scoreMinimum?: number;             // % requis
  tauxReussite?: number;             // % historique

  diplomeInclus?: boolean;
  garantieRemboursement?: string;

  categoryCertification?: CategoryCertification;

  avantages?: CertificationAvantage[];
  competencesValidees?: string[];
  publicCible?: string[];

  plateforme?: Plateforme;
  avis?: Avis[];
}