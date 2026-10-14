import { Component, OnInit } from '@angular/core';
import { DataService, WizardQuestion, Service } from '../../services/data.service';
import { AgencyConfigService } from '../../services/agency-config.service';

type WizardState = 'questions' | 'results';

@Component({
  selector: 'app-wizard',
  templateUrl: 'wizard.page.html',
  styleUrls: ['wizard.page.scss'],
})
export class WizardPage implements OnInit {
  questions: WizardQuestion[] = [];
  currentIndex = 0;
  selectedTags: string[] = [];
  state: WizardState = 'questions';
  results: Service[] = [];
  selectedService: Service | null = null;
  isModalOpen = false;
  agencyName = '';
  contactEmail = '';

  constructor(
    private dataService: DataService,
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
    return ((this.currentIndex) / this.questions.length) * 100;
  }

  selectAnswer(tag: string) {
    if (tag !== 'any') {
      this.selectedTags.push(tag);
    }
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    } else {
      this.showResults();
    }
  }

  showResults() {
    this.results = this.dataService.getServicesByTags(this.selectedTags);
    this.state = 'results';
  }

  restart() {
    this.currentIndex = 0;
    this.selectedTags = [];
    this.state = 'questions';
    this.results = [];
  }

  openService(service: Service) {
    this.selectedService = service;
    this.isModalOpen = true;
  }

  closeService() {
    this.isModalOpen = false;
    this.selectedService = null;
  }
}
