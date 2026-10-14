import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadPageRoutingModule } from './upload-routing.module';
import { UploadPage } from './upload.page';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    MatProgressSpinnerModule,
    UploadPageRoutingModule,
  ],
  declarations: [UploadPage],
})
export class UploadPageModule {}
