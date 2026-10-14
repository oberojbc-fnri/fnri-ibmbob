import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Fuse from 'fuse.js';
import { AGENCIES, ALL_AGENCY_SERVICES, AgencyMeta, AgencyService } from '../../data/agencies/index';

@Component({
  selector: 'app-landing',
  templateUrl: 'landing.page.html',
  styleUrls: ['landing.page.scss'],
})
export class LandingPage implements OnInit {
  agencies: AgencyMeta[] = AGENCIES;
  query = '';
  results: AgencyService[] = [];
  hasSearched = false;
  selectedService: AgencyService | null = null;
  isModalOpen = false;

  private fuse!: Fuse<AgencyService>;
  private querySubject = new Subject<string>();

  constructor(private router: Router) {}

  ngOnInit() {
    this.fuse = new Fuse(ALL_AGENCY_SERVICES, {
      keys: [
        { name: 'plainName',   weight: 0.4 },
        { name: 'description', weight: 0.25 },
        { name: 'tags',        weight: 0.2 },
        { name: 'agencyName',  weight: 0.1 },
        { name: 'category',    weight: 0.05 },
      ],
      threshold: 0.4,
      minMatchCharLength: 2,
      includeScore: true,
    });

    this.querySubject.pipe(debounceTime(300)).subscribe(q => {
      this.results = this.fuse.search(q).map(r => r.item);
    });
  }

  onSearchInput(event: any) {
    this.query = event.target.value || '';
    this.hasSearched = this.query.trim().length >= 2;
    if (!this.hasSearched) this.results = [];
    this.querySubject.next(this.query);
  }

  goToAgency(agency: AgencyMeta) {
    this.router.navigate(['/tabs/search']);
  }

  openService(service: AgencyService) {
    this.selectedService = service;
    this.isModalOpen = true;
  }

  closeService() {
    this.isModalOpen = false;
    this.selectedService = null;
  }
}
