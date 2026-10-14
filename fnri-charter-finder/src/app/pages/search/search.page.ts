import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { DataService, Service } from '../../services/data.service';
import { AgencyConfigService } from '../../services/agency-config.service';

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

  agencyName = '';
  tagline = '';

  suggestions = ['food testing', 'nutrition training', 'survey data', 'nutrition label', 'laboratory'];

  private querySubject = new Subject<string>();
  private sub!: Subscription;
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private searchService: SearchService,
    private dataService: DataService,
    private agencyConfigService: AgencyConfigService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.agencyName = this.agencyConfigService.config.agencyName;
    this.tagline = this.agencyConfigService.config.tagline;
    this.sub = this.querySubject.pipe(debounceTime(250)).subscribe(q => {
      this.results = this.searchService.search(q);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onQueryChange(value: string) {
    this.query = value;
    this.hasSearched = value.trim().length >= 2;
    if (!this.hasSearched) {
      this.results = [];
    }
    this.querySubject.next(value);
  }

  clearSearch() {
    this.onQueryChange('');
  }

  openDetail(service: Service) {
    this.selectedService = service;
    this.dialogRef = this.dialog.open(this.detailTpl, {
      maxWidth: '560px',
      width: '95vw',
      panelClass: 'detail-dialog',
    });
  }

  getCategoryColor(categoryId: string): string {
    const cat = this.dataService.getCategoryById(categoryId);
    return cat ? cat.color : '#5e6ad2';
  }
}
