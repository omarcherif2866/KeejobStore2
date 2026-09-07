// import { EvaluationDescription } from "./evaluation-description";

import { PriceSection } from "./coaching";
import { EvaluationCatalogue } from "./evaluation-catalogue";



export enum Category {
  TEST_PERSONNALITE = 'Test de personnalité',
  TEST_BUREAUTIQUE = 'Test bureautique',
  TEST_APTITUDE = "Test d'aptitude"
}

export interface Details {
  titre: string;
  description: string;
  icon: any;
  category: Category | null;
  
}

export enum EvaluationCategory {
  Les_tests_psychometriques = 'Les_tests_psychometriques',
  Les_tests_de_competences = 'Les_tests_de_competences'
}





export interface EvaluationSection {
  headline: string;
  subtitle: string;
  details: Details[];
}

export class Evaluation {
  private id: any;
  private name: string | null;
  private description: string | null;
  private image: string | null;
  private logo: string | null;
  private sections: EvaluationSection[];
  private evaluationCatalogues: EvaluationCatalogue[] = [];
  private evaluationCategory: EvaluationCategory;
  private priceSections: PriceSection[];
  

  constructor(data: any = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? null;
    this.description = data.description ?? null;
    this.image = data.image ?? null;
    this.logo = data.logo ?? null;
    this.sections = Array.isArray(data.sections) ? data.sections : [];
    this.priceSections = Array.isArray(data.priceSections) ? data.priceSections : [];

    this.evaluationCatalogues = Array.isArray(data.evaluationCatalogues)
      ? data.evaluationCatalogues.map((cat: any) => {
          const catalogue = new EvaluationCatalogue(cat.title || '', cat.image || '');
          catalogue.Id = cat.id;
          catalogue.EvaluationId = this.id;
          return catalogue;
        })
      : [];
    this.evaluationCategory = data.evaluationCategory ?? null;
      
  }

  // --- GETTERS & SETTERS --- //

  public get Id(): any {
    return this.id;
  }
  public set Id(value: any) {
    this.id = value;
  }

  public get Name(): string | null {
    return this.name;
  }
  public set Name(value: string | null) {
    this.name = value;
  }

  public get Description(): string | null {
    return this.description;
  }
  public set Description(value: string | null) {
    this.description = value;
  }

  public get Image(): string | null {
    return this.image;
  }
  public set Image(value: string | null) {
    this.image = value;
  }

    public get Logo(): string | null {
    return this.logo;
  }
  public set Logo(value: string | null) {
    this.logo = value;
  }


  public get Sections(): EvaluationSection[] {
    return this.sections;
  }
  public set Sections(value: EvaluationSection[]) {
    this.sections = value;
  }


  public get Catalogues(): EvaluationCatalogue[] {
    return this.evaluationCatalogues;
  }
  public set Catalogues(evaluationCatalogues: EvaluationCatalogue[]) {
    this.evaluationCatalogues = evaluationCatalogues;
  }

    public get Category(): EvaluationCategory {
      return this.evaluationCategory;
    }
  
    public set Category(evaluationCategory: EvaluationCategory) {
      this.evaluationCategory = evaluationCategory;
    }

    public get PriceSection(): PriceSection[] {
    return this.priceSections;
  }
  public set PriceSection(value: PriceSection[]) {
    this.priceSections = value;
  }

}