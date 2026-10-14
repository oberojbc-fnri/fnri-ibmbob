import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

const API_BASE = 'http://localhost:3000';

const GENERIC_CATEGORIES = [
  { value: 'laboratory',   label: 'Laboratory Testing' },
  { value: 'training',     label: 'Training & Capacity Building' },
  { value: 'consultancy',  label: 'Technical Consultancy' },
  { value: 'data',         label: 'Research & Data' },
  { value: 'library',      label: 'Library & Information' },
  { value: 'information',  label: 'Information & Scholarships' },
  { value: 'regulatory',   label: 'Regulatory & Compliance' },
  { value: 'other',        label: 'Other' },
];

@Component({
  selector: 'app-review',
  templateUrl: 'review.page.html',
  styleUrls: ['review.page.scss'],
})
export class ReviewPage implements OnInit {
  services: any[] = [];
  agencyName = '';
  agencyId = '';
  categories = GENERIC_CATEGORIES;
  isPublishing = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    const state = history.state;
    if (state?.services) {
      this.services = state.services.map((s: any) => ({ ...s }));
      this.agencyName = state.agencyName || '';
      this.agencyId   = state.agencyId   || 'agency';
    } else {
      // No state — redirect back to upload
      this.router.navigate(['/upload']);
    }
  }

  addRow() {
    const idx = String(this.services.length + 1).padStart(3, '0');
    this.services.push({
      id:             `${this.agencyId}-s${idx}`,
      plainName:      '',
      officialName:   '',
      description:    '',
      category:       'other',
      office:         '',
      whoMayAvail:    '',
      requirements:   [],
      processingTime: '',
      fees:           '',
      tags:           [],
    });
  }

  deleteRow(index: number) {
    this.services.splice(index, 1);
  }

  trackByIndex(index: number) {
    return index;
  }

  async publish() {
    if (this.services.length === 0) return;
    this.isPublishing = true;
    this.errorMessage = '';

    const payload = {
      agencyId: this.agencyId,
      agencyConfig: { agencyName: this.agencyName, agencyId: this.agencyId },
      services: this.services,
    };

    this.http.post<{ success: boolean; message: string }>
      (`${API_BASE}/api/publish`, payload).subscribe({
      next: async (result) => {
        this.isPublishing = false;
        const alert = await this.alertCtrl.create({
          header: 'Published! 🎉',
          message: result.message + '\n\nRebuild the Angular app to make it live.',
          buttons: [
            { text: 'Upload Another', handler: () => this.router.navigate(['/upload']) },
            { text: 'Go to Agencies', role: 'cancel', handler: () => this.router.navigate(['/landing']) },
          ],
        });
        await alert.present();
      },
      error: (err) => {
        this.isPublishing = false;
        this.errorMessage = err.error?.error || 'Publish failed. Make sure the backend server is running.';
      },
    });
  }

  startOver() {
    this.router.navigate(['/upload']);
  }
}
