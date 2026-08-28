import { CentreFormation } from "./centre-formation";
import { FormationKeejob } from "./formation-keejob";

export interface Avis {
  id?: number;
  nomAuteur: string;
  poste: string;
  note: number;          // 1 à 5
  commentaire: string;
  date: string;           // format ISO "yyyy-MM-dd" (LocalDate côté Java)
  centre?: CentreFormation | { id: number }; // selon besoin d'affichage ou juste la ref
  formation?: FormationKeejob | { id: number };

}