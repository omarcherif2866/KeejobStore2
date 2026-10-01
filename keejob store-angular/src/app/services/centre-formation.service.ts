import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CentreFormation } from '../models/centre-formation';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CentreFormationService {

  // private apiUrl = "http://localhost:9090/centres-formation";
  private apiUrl = "/api/centres-formation";
private centreFormationCache = new Map<string, Observable<CentreFormation>>();

  constructor(private http: HttpClient) {}

  getAllCentres(): Observable<CentreFormation[]> {
    return this.http.get<CentreFormation[]>(this.apiUrl);
  }

getById(id: number): Observable<CentreFormation> {
  const key = id.toString();
  if (!this.centreFormationCache.has(key)) {
    const request$ = this.http.get<CentreFormation>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        this.centreFormationCache.delete(key);
        return throwError(error);
      }),
      shareReplay(1)
    );
    this.centreFormationCache.set(key, request$);
  }
  return this.centreFormationCache.get(key)!;
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