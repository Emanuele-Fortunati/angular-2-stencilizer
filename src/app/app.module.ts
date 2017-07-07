import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { ImageStencilizerComponent } from './image-stencilizer/image-stencilizer.component';
import { StencilizerSettingsComponent } from './image-stencilizer/image-stencilizer.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageSelectorComponent,
    ImageStencilizerComponent,
    StencilizerSettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
