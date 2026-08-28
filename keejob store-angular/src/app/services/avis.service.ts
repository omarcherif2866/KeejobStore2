import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avis } from '../models/avis';

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  // private apiUrl = "http://localhost:9090/avis";
    private apiUrl = "/api/avis";

  constructor(private http: HttpClient) {}

  getAllAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.apiUrl);
  }

  getAvisByCentre(centreId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/centre/${centreId}`);
  }

  getAvisById(id: number): Observable<Avis> {
    return this.http.get<Avis>(`${this.apiUrl}/${id}`);
  }

  createAvis(centreId: number, avis: Avis): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/centre/${centreId}`, avis);
  }

  updateAvis(id: number, avis: Avis): Observable<Avis> {
    return this.http.put<Avis>(`${this.apiUrl}/${id}`, avis);
  }

  deleteAvis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    getAvisByFormation(formationId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/formation/${formationId}`);
  }

createAvisForFormation(formationId: number, avis: Avis): Observable<Avis> {
  return this.http.post<Avis>(`${this.apiUrl}/formation/${formationId}`, avis);
}
}