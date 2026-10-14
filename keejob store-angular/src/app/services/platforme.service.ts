import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Plateforme } from '../models/platforme';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlateformeService {

  // private apiUrl = "http://localhost:9090/plateformes";
  private apiUrl = "/api/plateformes";
private plateformeCache = new Map<string, Observable<Plateforme>>();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Plateforme[]> {
    return this.http.get<Plateforme[]>(this.apiUrl);
  }

getById(id: number): Observable<Plateforme> {
  const key = id.toString();
  if (!this.plateformeCache.has(key)) {
    const request$ = this.http.get<Plateforme>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        this.plateformeCache.delete(key);
        return throwError(error);
      }),
      shareReplay(1)
    );
    this.plateformeCache.set(key, request$);
  }
  return this.plateformeCache.get(key)!;
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