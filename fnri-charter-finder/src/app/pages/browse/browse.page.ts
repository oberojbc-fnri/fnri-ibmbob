import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService, Category, Service } from '../../services/data.service';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss'],
})
export class BrowsePage implements OnInit {
  @ViewChild('detailTpl') detailTpl!: TemplateRef<any>;

  categories: Category[] = [];
  selectedCategory: Category | null = null;
  servicesInCategory: Service[] = [];
  selectedService: Service | null = null;
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.categories = this.dataService.getCategories();
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
    this.dialogRef = this.dialog.open(this.detailTpl, {
      maxWidth: '560px',
      width: '95vw',
      panelClass: 'detail-dialog',
    });
  }
}
