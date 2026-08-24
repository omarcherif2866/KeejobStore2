import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CvRequestPayload {
  fullname: string;
  email: string;
  whatsapp: string;
  cvFile?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class CvRequestService {

  // private apiUrl = "http://localhost:9090/cv-request";
  private apiUrl = "/api/cv-request";
  constructor(private http: HttpClient) {}

  sendCvRequest(data: CvRequestPayload): Observable<any> {
    const formData = new FormData();
    formData.append('fullname', data.fullname);
    formData.append('email', data.email);
    formData.append('whatsapp', data.whatsapp);

    if (data.cvFile) {
      formData.append('cvFile', data.cvFile);
    }

    return this.http.post(this.apiUrl, formData);
  }
}