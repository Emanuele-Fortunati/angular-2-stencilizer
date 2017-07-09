import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { ImageSelectorWebcamComponent } from './image-selector/image-selector.component';
import { ImageStencilizerComponent } from './image-stencilizer/image-stencilizer.component';
import { StencilizerSettingsComponent } from './image-stencilizer/image-stencilizer.component';
import { DynamicCopyComponent } from './dynamic-copy/dynamic-copy.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageSelectorComponent,
    ImageSelectorWebcamComponent,
    ImageStencilizerComponent,
    StencilizerSettingsComponent,
    DynamicCopyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    FlexLayoutModule
  ],
  entryComponents: [
    StencilizerSettingsComponent,
    ImageSelectorWebcamComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
