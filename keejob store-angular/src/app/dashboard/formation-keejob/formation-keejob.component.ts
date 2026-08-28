import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormationCategory, FormationKeejob } from 'src/app/models/formation-keejob';
import { AuthService } from 'src/app/services/auth.service';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';

import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-formation-keejob',
  templateUrl: './formation-keejob.component.html',
  styleUrls: ['./formation-keejob.component.css']
})
export class FormationKeejobComponent implements OnInit {

  constructor(
    private formationsKeejobervice: FormationKeejobService, 
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}



  ngOnInit() {

  }

 

}