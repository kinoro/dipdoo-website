import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterRouteComponent } from './routes/public/register-route/register-route.component';
import { ConfirmEmailRouteComponent } from './routes/public/confirm-email-route/confirm-email-route.component';
import { SignInRouteComponent } from './routes/public/sign-in-route/sign-in-route.component';
import { HomeRouteComponent } from './routes/public/home-route/home-route.component';
import { AboutRouteComponent } from './routes/public/about-route/about-route.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { TermsOfServiceRouteComponent } from './routes/public/terms-of-service-route/terms-of-service-route.component';
import { EditPostRouteComponent } from './routes/public/edit-post-route/edit-post-route.component';
import { ViewPostRouteComponent } from './routes/public/view-post-route/view-post-route.component';
import { ViewUserRouteComponent } from './routes/public/view-user-route/view-user-route.component';
import { ViewReportedPostsRouteComponent } from './routes/public/view-reported-posts-route/view-reported-posts-route.component';
import { IsAdminGuard } from './guards/is-admin.guard';
import { ResetPasswordRouteComponent } from './routes/public/reset-password-route/reset-password-route.component';
import { SendResetPasswordRouteComponent } from './routes/public/send-reset-password-route/send-reset-password-route.component';
import { ViewAnnouncementsRouteComponent } from './routes/public/view-announcements-route/view-announcements-route.component';
import { SearchPostsRouteComponent } from './routes/public/search-posts-route/search-posts-route.component';
import { ViewPostsRouteComponent } from './routes/public/view-posts-route/view-posts-route.component';

const routes: Routes = [
  { path: '', redirectTo: 'posts/hot', pathMatch: 'full' },
  { path: 'home', redirectTo: 'posts/hot', pathMatch: 'full' },
  { path: 'about', component: AboutRouteComponent },
  { path: 'terms-of-service', component: TermsOfServiceRouteComponent },
  { path: 'edit-post', component: EditPostRouteComponent },
  { path: 'reported-posts', component: ViewReportedPostsRouteComponent, canActivate: [IsAdminGuard] },
  { path: 'announcements', component: ViewAnnouncementsRouteComponent, canActivate: [IsAdminGuard] },
  { path: 'sign-up', component: RegisterRouteComponent },
  { path: 'sign-in', component: SignInRouteComponent },
  { path: 'confirm-email', component: ConfirmEmailRouteComponent },
  { path: 'reset-password', component: ResetPasswordRouteComponent },
  { path: 'send-reset-password', component: SendResetPasswordRouteComponent },
  { path: 'search/:searchTerm', component: SearchPostsRouteComponent },
  { path: 'search', component: SearchPostsRouteComponent },
  { path: 'posts', component: ViewPostsRouteComponent },
  { path: 'posts/:orderBy', component: ViewPostsRouteComponent },
  { path: 'posts/:orderBy/:tag', component: ViewPostsRouteComponent },
  { path: 'u/:username', component: ViewUserRouteComponent },
  { path: 'u/:username/:usertab', component: ViewUserRouteComponent },
  { path: 'post/:postFriendlyId', component: ViewPostRouteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
