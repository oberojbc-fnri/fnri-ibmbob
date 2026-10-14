import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Fuse from 'fuse.js';
import { AGENCIES, ALL_AGENCY_SERVICES, AgencyMeta, AgencyService } from '../../data/agencies/index';
import { AgencyContextService } from '../../services/agency-context.service';

@Component({
  selector: 'app-landing',
  templateUrl: 'landing.page.html',
  styleUrls: ['landing.page.scss'],
})
export class LandingPage implements OnInit {
  @ViewChild('detailTpl') detailTpl!: TemplateRef<any>;

  agencies: AgencyMeta[] = AGENCIES;
  query = '';
  results: AgencyService[] = [];
  hasSearched = false;
  selectedService: AgencyService | null = null;

  private fuse!: Fuse<AgencyService>;
  private querySubject = new Subject<string>();
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private router: Router,
    private bp: BreakpointObserver,
    private agencyContext: AgencyContextService,
    private dialog: MatDialog,
  ) {}

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

  onSearchInput(event: Event) {
    this.query = (event.target as HTMLInputElement).value ?? '';
    this.hasSearched = this.query.trim().length >= 2;
    if (!this.hasSearched) this.results = [];
    this.querySubject.next(this.query);
  }

  clearSearch() {
    this.query = '';
    this.hasSearched = false;
    this.results = [];
  }

  goToAgency(agency: AgencyMeta) {
    this.agencyContext.setAgency(agency.id);
    const isDesktop = this.bp.isMatched('(min-width: 960px)');
    this.router.navigate([isDesktop ? '/search' : '/tabs/search']);
  }

  openService(service: AgencyService) {
    this.selectedService = service;
    this.dialogRef = this.dialog.open(this.detailTpl, {
      maxWidth: '560px', width: '95vw', panelClass: 'detail-dialog',
    });
  }
}
