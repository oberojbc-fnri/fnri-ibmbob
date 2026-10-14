import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService, WizardQuestion, Service } from '../../services/data.service';
import { AgencyContextService } from '../../services/agency-context.service';
import { AGENCIES, AgencyMeta } from '../../data/agencies/index';

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
  /** Active agency filter — null means all-agencies */
  agency: AgencyMeta | null = null;
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private agencyContext: AgencyContextService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.agency = this.agencyContext.agency;
    this.questions = this.agency
      ? this.dataService.getWizardQuestionsForAgency(this.agency.id)
      : this.dataService.getWizardQuestions();
  }

  get currentQuestion(): WizardQuestion {
    return this.questions[this.currentIndex];
  }

  get progress(): number {
    return (this.currentIndex / this.questions.length) * 100;
  }

  selectAnswer(tag: string) {
    if (tag !== 'any') this.selectedTags.push(tag);
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    } else {
      this.results = this.agency
        ? this.dataService.getServicesByTagsForAgency(this.selectedTags, this.agency.id)
        : this.dataService.getServicesByTags(this.selectedTags);
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
      maxWidth: '560px', width: '95vw', panelClass: 'detail-dialog',
    });
  }

  getAgencyContact(service: Service | null): { email: string; website: string } {
    const ag = AGENCIES.find(a => a.id === service?.agencyId);
    return { email: ag?.contact.email ?? '', website: ag?.contact.website ?? '' };
  }

  goBackToAllAgencies() {
    this.agencyContext.clear();
    this.router.navigate(['/landing']);
  }
}
