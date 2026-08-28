import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plateforme } from '../models/platforme';

@Injectable({
  providedIn: 'root'
})
export class PlateformeService {

  // private apiUrl = "http://localhost:9090/plateformes";
  private apiUrl = "/api/plateformes";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Plateforme[]> {
    return this.http.get<Plateforme[]>(this.apiUrl);
  }

  getById(id: number): Observable<Plateforme> {
    return this.http.get<Plateforme>(`${this.apiUrl}/${id}`);
  }

  // ✅ Création avec logo + imageIllustration (multipart)
  create(plateforme: Plateforme, logo?: File, imageIllustration?: File): Observable<Plateforme> {
    const formData = new FormData();
    formData.append('plateforme', new Blob([JSON.stringify(plateforme)], { type: 'application/json' }));
    if (logo) {
      formData.append('logo', logo);
    }
    if (imageIllustration) {
      formData.append('imageIllustration', imageIllustration);
    }
    return this.http.post<Plateforme>(this.apiUrl, formData);
  }

  // ✅ Mise à jour avec logo + imageIllustration (multipart)
  update(id: number, plateforme: Plateforme, logo?: File, imageIllustration?: File): Observable<Plateforme> {
    const formData = new FormData();
    formData.append('plateforme', new Blob([JSON.stringify(plateforme)], { type: 'application/json' }));
    if (logo) {
      formData.append('logo', logo);
    }
    if (imageIllustration) {
      formData.append('imageIllustration', imageIllustration);
    }
    return this.http.put<Plateforme>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPopulaires(): Observable<Plateforme[]> {
    return this.http.get<Plateforme[]>(`${this.apiUrl}/populaires`);
  }

  search(q: string): Observable<Plateforme[]> {
    return this.http.get<Plateforme[]>(`${this.apiUrl}/search`, { params: { q } });
  }
}