export interface Plateforme {
  id?: number;
  nom: string;                    // "Udemy"
  logo: string;                   // URL Cloudinary
  populaire: boolean;

  note: number;                   // 4.6
  nombreAvis: string;             // "72k"
  nombreApprenants: string;       // "62M+"

  description: string;

  siteWeb: string;
  // imageIllustration: string;      

  categories: string[];


}