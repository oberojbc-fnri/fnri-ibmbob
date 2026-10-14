import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { DataService, Service } from '../../services/data.service';
import { AgencyContextService } from '../../services/agency-context.service';
import { AGENCIES, AgencyMeta } from '../../data/agencies/index';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {
  @ViewChild('detailTpl') detailTpl!: TemplateRef<any>;

  query = '';
  results: Service[] = [];
  selectedService: Service | null = null;
  hasSearched = false;
  agency: AgencyMeta | null = null;

  get suggestions(): string[] {
    if (this.agency?.id === 'pnri') return ['radiation', 'dosimetry', 'irradiation', 'nuclear', 'sterilization'];
    if (this.agency?.id === 'sei')  return ['scholarship', 'DOST scholar', 'science olympiad', 'youth program'];
    if (this.agency?.id === 'fnri') return ['food testing', 'nutrition label', 'dietary assessment', 'food composition'];
    return ['food testing', 'nutrition training', 'irradiation', 'scholarship', 'radiation dosimetry'];
  }

  private querySubject = new Subject<string>();
  private subs: Subscription[] = [];
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private searchService: SearchService,
    private dataService: DataService,
    private dialog: MatDialog,
    private agencyContext: AgencyContextService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Re-run whenever agency context changes (covers same-route navigation)
    this.subs.push(
      this.agencyContext.agencyId$.subscribe(() => {
        this.agency = this.agencyContext.agency;
        // Reset search state when agency switches
        this.query = '';
        this.results = [];
        this.hasSearched = false;
      })
    );

    this.subs.push(
      this.querySubject.pipe(debounceTime(250)).subscribe(q => {
        this.results = this.searchService.search(q, this.agency?.id ?? null);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  onQueryChange(value: string) {
    this.query = value;
    this.hasSearched = value.trim().length >= 2;
    if (!this.hasSearched) this.results = [];
    this.querySubject.next(value);
  }

  clearSearch() { this.onQueryChange(''); }

  openDetail(service: Service) {
    this.selectedService = service;
    this.dialogRef = this.dialog.open(this.detailTpl, {
      maxWidth: '560px', width: '95vw', panelClass: 'detail-dialog',
    });
  }

  getCategoryColor(categoryId: string): string {
    const cat = this.dataService.getCategoryById(categoryId);
    return cat ? cat.color : '#5e6ad2';
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
