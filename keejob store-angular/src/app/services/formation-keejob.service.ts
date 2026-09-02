import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FormationCategory, FormationKeejob } from '../models/formation-keejob';

@Injectable({
  providedIn: 'root'
})
export class FormationKeejobService {
  // private apiUrl = "http://localhost:9090/formationKeejob";
  private apiUrl = "/api/formationKeejob";


  constructor(private http: HttpClient) {}

  getAll(): Observable<FormationKeejob[]> {
    return this.http.get<FormationKeejob[]>(this.apiUrl);
  }

  getById(id: number): Observable<FormationKeejob> {
    return this.http.get<FormationKeejob>(`${this.apiUrl}/${id}`);
  }

  // ✅ Création avec image (multipart)
  create(formation: FormationKeejob, plateformeId: number, image?: File): Observable<FormationKeejob> {
    const formData = new FormData();
    formData.append('formation', new Blob([JSON.stringify(formation)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<FormationKeejob>(`${this.apiUrl}/plateforme/${plateformeId}`, formData);
  }

  // ✅ Mise à jour avec image (multipart)
update(id: number, formation: FormationKeejob, plateformeId: number, image?: File): Observable<FormationKeejob> {
  const formData = new FormData();
  formData.append('formation', new Blob([JSON.stringify(formation)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }
  return this.http.put<FormationKeejob>(`${this.apiUrl}/${id}/plateforme/${plateformeId}`, formData);
}

  // ✅ Upload d'une icône seule (pour "avantages")
  uploadIcon(icon: File): Observable<string> {
    const formData = new FormData();
    formData.append('icon', icon);
    return this.http.post(`${this.apiUrl}/upload-icon`, formData, { responseType: 'text' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByPlateforme(plateformeId: number): Observable<FormationKeejob[]> {
    return this.http.get<FormationKeejob[]>(`${this.apiUrl}/plateforme/${plateformeId}`);
  }

  search(q: string): Observable<FormationKeejob[]> {
    return this.http.get<FormationKeejob[]>(`${this.apiUrl}/search`, { params: { q } });
  }

  getByCategory(category: string): Observable<FormationKeejob[]> {
    return this.http.get<FormationKeejob[]>(`${this.apiUrl}/by-category/${category}`);
  }
}