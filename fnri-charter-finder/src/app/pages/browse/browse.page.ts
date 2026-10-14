import { Component, OnInit } from '@angular/core';
import { DataService, Category, Service } from '../../services/data.service';
import { AgencyConfigService } from '../../services/agency-config.service';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss'],
})
export class BrowsePage implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  servicesInCategory: Service[] = [];
  selectedService: Service | null = null;
  isServiceModalOpen = false;
  agencyName = '';
  contactEmail = '';
  websiteUrl = '';

  constructor(
    private dataService: DataService,
    private agencyConfigService: AgencyConfigService
  ) {}

  ngOnInit() {
    this.categories = this.dataService.getCategories();
    this.agencyName = this.agencyConfigService.config.agencyName;
    this.contactEmail = this.agencyConfigService.contactEmail;
    this.websiteUrl = this.agencyConfigService.websiteUrl;
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
    this.servicesInCategory = this.dataService.getServicesByCategory(cat.id);
  }

  backToCategories() {
    this.selectedCategory = null;
    this.servicesInCategory = [];
  }

  openService(service: Service) {
    this.selectedService = service;
    this.isServiceModalOpen = true;
  }

  closeService() {
    this.isServiceModalOpen = false;
    this.selectedService = null;
  }
}
