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
  /** 'ollama-offline' | 'scanned-pdf' | 'generic' | '' */
  errorType = '';

  get progressLabel(): string {
    if (this.uploadProgress < 20) return 'Uploading PDF…';
    if (this.uploadProgress < 50) return 'Extracting text…';
    if (this.uploadProgress < 85) return 'Reading charter with AI…';
    return 'Almost done…';
  }

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
      this.errorType = 'generic';
      return;
    }
    this.selectedFile = file;
    this.errorMessage = '';
    this.errorType = '';
    // Auto-fill agency ID from filename if not set
    if (!this.agencyId) {
      this.agencyId = file.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase().slice(0, 20);
    }
  }

  clearFile() {
    this.selectedFile = null;
    this.errorMessage = '';
    this.errorType = '';
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

        const serverMsg: string = err.error?.error || err.message || '';

        if (err.status === 0 || serverMsg.toLowerCase().includes('cannot reach ollama') || serverMsg.toLowerCase().includes('econnrefused')) {
          this.errorType = 'ollama-offline';
        } else if (serverMsg.toLowerCase().includes('scanned') || serverMsg.toLowerCase().includes('image-based')) {
          this.errorType = 'scanned-pdf';
        } else {
          this.errorType = 'generic';
        }
        this.errorMessage = serverMsg;
      },
    });
  }
}
