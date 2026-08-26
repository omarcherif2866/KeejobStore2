import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CentreFormation } from '../models/centre-formation';

@Injectable({
  providedIn: 'root'
})
export class CentreFormationService {

  // private apiUrl = "http://localhost:9090/centres-formation";
  private apiUrl = "/api/centres-formation";

  constructor(private http: HttpClient) {}

  getAllCentres(): Observable<CentreFormation[]> {
    return this.http.get<CentreFormation[]>(this.apiUrl);
  }

  getCentreById(id: number): Observable<CentreFormation> {
    return this.http.get<CentreFormation>(`${this.apiUrl}/${id}`);
  }

  // ⬇️ Accepte désormais du FormData (multipart), plus un objet CentreFormation en JSON
  createCentre(centre: FormData): Observable<CentreFormation> {
    return this.http.post<CentreFormation>(this.apiUrl, centre);
  }

  updateCentre(id: number, centre: FormData): Observable<CentreFormation> {
    return this.http.put<CentreFormation>(`${this.apiUrl}/${id}`, centre);
  }

  deleteCentre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCentresCertifies(): Observable<CentreFormation[]> {
    return this.http.get<CentreFormation[]>(`${this.apiUrl}/certifies`);
  }

  searchByLocalisation(q: string): Observable<CentreFormation[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<CentreFormation[]>(`${this.apiUrl}/search/localisation`, { params });
  }

  searchByNom(q: string): Observable<CentreFormation[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<CentreFormation[]>(`${this.apiUrl}/search/nom`, { params });
  }

  searchByDomaine(q: string): Observable<CentreFormation[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<CentreFormation[]>(`${this.apiUrl}/search/domaine`, { params });
  }
}