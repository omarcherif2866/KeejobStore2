import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CvRequestPayload {
  fullname: string;
  email: string;
  whatsapp: string;
  cvFile?: File | null;
  serviceName: string;   // ← ajout

}

@Injectable({
  providedIn: 'root'
})
export class CvRequestService {

  // private apiUrl = "http://localhost:9090/cv-request";
  private apiUrl = "/api/cv-request";
  constructor(private http: HttpClient) {}

sendCvRequest(data: {
  fullname: string;
  email: string;
  whatsapp: string;
  cvFiles: File[];
  serviceName: string;
}) {
  const formData = new FormData();
  formData.append('fullname', data.fullname);
  formData.append('email', data.email);
  formData.append('whatsapp', data.whatsapp);
  formData.append('serviceName', data.serviceName);

  data.cvFiles.forEach(file => {
    formData.append('cvFiles', file);   // même nom répété = tableau côté backend
  });

  return this.http.post(`${this.apiUrl}/cv-request`, formData);
}
}