import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewAnnouncementsAnnouncementComponent } from './view-announcements-announcement/view-announcements-announcement.component';
import { ViewAnnouncementsMainContentComponent } from './view-announcements-main-content/view-announcements-main-content.component';
import { ViewAnnouncementsComponent } from './view-announcements.component';
import { ViewAnnouncementsAddComponent } from './view-announcements-add/view-announcements-add.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
   imports: [
    SharedModule
   ],
   declarations: [
      ViewAnnouncementsComponent,
      ViewAnnouncementsAddComponent,
      ViewAnnouncementsMainContentComponent,
      ViewAnnouncementsAnnouncementComponent
   ],
   exports: [
      ViewAnnouncementsComponent
   ]
})
export class ViewAnnouncementsModule { }
