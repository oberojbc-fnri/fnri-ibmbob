import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'http://localhost:3000';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss'],
})
export class UploadPage {
  agencyName = '';
  agencyId = '';
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.setFile(file);
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.setFile(file);
  }

  setFile(file: File) {
    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Only PDF files are accepted.';
      return;
    }
    this.selectedFile = file;
    this.errorMessage = '';
    // Auto-fill agency ID from filename if not set
    if (!this.agencyId) {
      this.agencyId = file.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase().slice(0, 20);
    }
  }

  canUpload(): boolean {
    return !!this.selectedFile && this.agencyName.trim().length > 0;
  }

  async uploadAndExtract() {
    if (!this.canUpload() || !this.selectedFile) return;
    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('agencyId', this.agencyId.trim() || 'agency');

    // Simulate progress while waiting
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 85) this.uploadProgress += 5;
    }, 800);

    this.http.post<{ services: any[]; pageCount: number; agencyId: string }>
      (`${API_BASE}/api/extract`, formData).subscribe({
      next: (result) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.router.navigate(['/review'], {
            state: {
              services: result.services,
              agencyName: this.agencyName.trim(),
              agencyId: result.agencyId,
            },
          });
        }, 400);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.isUploading = false;
        this.uploadProgress = 0;
        this.errorMessage = err.error?.error || 'Upload failed. Make sure the backend server is running.';
      },
    });
  }
}
