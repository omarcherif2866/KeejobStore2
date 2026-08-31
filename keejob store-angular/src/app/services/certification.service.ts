import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Certification, CategoryCertification } from '../models/certification';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  // private apiUrl = "http://localhost:9090/certification";
  private apiUrl = "/api/certification";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Certification[]> {
    return this.http.get<Certification[]>(this.apiUrl);
  }

  getById(id: number): Observable<Certification> {
    return this.http.get<Certification>(`${this.apiUrl}/${id}`);
  }

  // ✅ Création avec image (multipart)
  create(certification: Certification, plateformeId: number, image?: File): Observable<Certification> {
    const formData = new FormData();
    formData.append('certification', new Blob([JSON.stringify(certification)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<Certification>(`${this.apiUrl}/plateforme/${plateformeId}`, formData);
  }

  // ✅ Mise à jour avec image (multipart)
  update(id: number, certification: Certification, image?: File): Observable<Certification> {
    const formData = new FormData();
    formData.append('certification', new Blob([JSON.stringify(certification)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return this.http.put<Certification>(`${this.apiUrl}/${id}`, formData);
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

  getByPlateforme(plateformeId: number): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.apiUrl}/plateforme/${plateformeId}`);
  }

  search(q: string): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.apiUrl}/search`, { params: { q } });
  }

  getByCategory(category: CategoryCertification | string): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.apiUrl}/by-category/${category}`);
  }
}