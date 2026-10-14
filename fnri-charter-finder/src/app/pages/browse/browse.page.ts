import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService, Category, Service } from '../../services/data.service';
import { AgencyContextService } from '../../services/agency-context.service';
import { AGENCIES, AgencyMeta } from '../../data/agencies/index';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss'],
})
export class BrowsePage implements OnInit, OnDestroy {
  @ViewChild('detailTpl') detailTpl!: TemplateRef<any>;

  categories: Category[] = [];
  selectedCategory: Category | null = null;
  servicesInCategory: Service[] = [];
  selectedService: Service | null = null;
  agency: AgencyMeta | null = null;

  private dialogRef: MatDialogRef<any> | null = null;
  private subs: Subscription[] = [];

  constructor(
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
        // Reset browse state when agency switches
        this.selectedCategory = null;
        this.servicesInCategory = [];
        this.categories = this.agency
          ? this.dataService.getCategoriesForAgency(this.agency.id)
          : this.dataService.getCategories();
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
    this.servicesInCategory = this.agency
      ? this.dataService.getServicesByCategoryForAgency(cat.id, this.agency.id)
      : this.dataService.getServicesByCategory(cat.id);
  }

  backToCategories() {
    this.selectedCategory = null;
    this.servicesInCategory = [];
  }

  getServiceCount(categoryId: string): number {
    return this.agency
      ? this.dataService.getServiceCountForAgency(categoryId, this.agency.id)
      : this.dataService.getServicesByCategory(categoryId).length;
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
