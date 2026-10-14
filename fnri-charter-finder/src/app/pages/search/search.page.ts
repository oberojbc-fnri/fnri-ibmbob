import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  query = '';
  results: Service[] = [];
  selectedService: Service | null = null;
  isModalOpen = false;
  hasSearched = false;

  agencyName = '';
  tagline = '';

  private querySubject = new Subject<string>();
  private sub!: Subscription;

  constructor(
    private searchService: SearchService,
    private dataService: DataService,
    private agencyConfigService: AgencyConfigService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.agencyName = this.agencyConfigService.config.agencyName;
    this.tagline = this.agencyConfigService.config.tagline;
    this.sub = this.querySubject.pipe(debounceTime(300)).subscribe(q => {
      this.results = this.searchService.search(q);
      this.hasSearched = q.trim().length >= 2;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onSearchInput(event: any) {
    this.query = event.target.value || '';
    this.querySubject.next(this.query);
  }

  openDetail(service: Service) {
    this.selectedService = service;
    this.isModalOpen = true;
  }

  closeDetail() {
    this.isModalOpen = false;
    this.selectedService = null;
  }

  getCategoryColor(categoryId: string): string {
    const cat = this.dataService.getCategoryById(categoryId);
    return cat ? cat.color : '#57606a';
  }
}
