import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Details, Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation-details.component.css']
})
export class EvaluationDetailsComponent implements OnInit {



  constructor(
    private evaluationservice: EvaluationService,   private route: ActivatedRoute) { }

  ngOnInit(): void {

  }

}