import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { HomeContainerComponent } from './components/home-container/home-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [
        HomeComponent,
        HomeHeaderComponent,
        HomeContainerComponent,
    ],
    exports: [HomeComponent]
})
export class HomeModule { }
