import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService, WizardQuestion, Service } from '../../services/data.service';
import { AgencyConfigService } from '../../services/agency-config.service';

type WizardState = 'questions' | 'results';

@Component({
  selector: 'app-wizard',
  templateUrl: 'wizard.page.html',
  styleUrls: ['wizard.page.scss'],
})
export class WizardPage implements OnInit {
  @ViewChild('detailTpl') detailTpl!: TemplateRef<any>;

  questions: WizardQuestion[] = [];
  currentIndex = 0;
  selectedTags: string[] = [];
  state: WizardState = 'questions';
  results: Service[] = [];
  selectedService: Service | null = null;
  agencyName = '';
  contactEmail = '';
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private agencyConfigService: AgencyConfigService,
  ) {}

  ngOnInit() {
    this.questions = this.dataService.getWizardQuestions();
    this.agencyName = this.agencyConfigService.config.agencyName;
    this.contactEmail = this.agencyConfigService.contactEmail;
  }

  get currentQuestion(): WizardQuestion {
    return this.questions[this.currentIndex];
  }

  get progress(): number {
    return (this.currentIndex / this.questions.length) * 100;
  }

  selectAnswer(tag: string) {
    if (tag !== 'any') {
      this.selectedTags.push(tag);
    }
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    } else {
      this.results = this.dataService.getServicesByTags(this.selectedTags);
      this.state = 'results';
    }
  }

  restart() {
    this.currentIndex = 0;
    this.selectedTags = [];
    this.state = 'questions';
    this.results = [];
  }

  openService(service: Service) {
    this.selectedService = service;
    this.dialogRef = this.dialog.open(this.detailTpl, {
      maxWidth: '560px',
      width: '95vw',
      panelClass: 'detail-dialog',
    });
  }
}
