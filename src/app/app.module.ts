import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppComponent } from './app.component';
import { RegisterUserModule } from './modules/register-user/register-user.module';
import { RegisterRouteComponent } from './routes/public/register-route/register-route.component';
import { ConfirmEmailRouteComponent } from './routes/public/confirm-email-route/confirm-email-route.component';
import { SignInModule } from './modules/sign-in/sign-in.module';
import { SignInRouteComponent } from './routes/public/sign-in-route/sign-in-route.component';
import { HomeRouteComponent } from './routes/public/home-route/home-route.component';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { ModalComponent } from './components/modal/modal.component';
import { HomeModule } from './modules/home/home.module';
import { AboutRouteComponent } from './routes/public/about-route/about-route.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { TermsOfServiceRouteComponent } from './routes/public/terms-of-service-route/terms-of-service-route.component';
import { EditPostModule } from './modules/edit-post/edit-post.module';
import { EditPostRouteComponent } from './routes/public/edit-post-route/edit-post-route.component';
import { ViewPostModule } from './modules/view-post/view-post.module';
import { ViewPostRouteComponent } from './routes/public/view-post-route/view-post-route.component';
import { ViewUserRouteComponent } from './routes/public/view-user-route/view-user-route.component';
import { ViewUserModule } from './modules/view-user/view-user.module';
import { ViewReportedPostsRouteComponent } from './routes/public/view-reported-posts-route/view-reported-posts-route.component';
import { ViewReportedPostsModule } from './modules/view-reported-posts/view-reported-posts.module';
import { IsAdminGuard } from './guards/is-admin.guard';
import { SendResetPasswordRouteComponent } from './routes/public/send-reset-password-route/send-reset-password-route.component';
import { ResetPasswordRouteComponent } from './routes/public/reset-password-route/reset-password-route.component';
import { SendResetPasswordModule } from './modules/send-reset-password/send-reset-password.module';
import { ViewAnnouncementsRouteComponent } from './routes/public/view-announcements-route/view-announcements-route.component';
import { ViewAnnouncementsModule } from './modules/view-announcements/view-announcements.module';
import { SearchPostsModule } from './modules/search-posts/search-posts.module';
import { SearchPostsRouteComponent } from './routes/public/search-posts-route/search-posts-route.component';
import { ViewPostsRouteComponent } from './routes/public/view-posts-route/view-posts-route.component';
import { ViewPostsModule } from './modules/view-posts/view-posts.module';
import { MediaModalComponent } from './modules/shared/media-modal/media-modal.component';

@NgModule({
    declarations: [
        AppComponent,

        ModalComponent,
        MediaModalComponent,

        HomeRouteComponent,
        AboutRouteComponent,
        TermsOfServiceRouteComponent,
        RegisterRouteComponent,
        ConfirmEmailRouteComponent,
        SignInRouteComponent,
        SendResetPasswordRouteComponent,
        ResetPasswordRouteComponent,
        ViewUserRouteComponent,
        ViewPostRouteComponent,
        ViewPostsRouteComponent,
        EditPostRouteComponent,
        ViewReportedPostsRouteComponent,
        ViewAnnouncementsRouteComponent,
        SearchPostsRouteComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        DeviceDetectorModule,

        RegisterUserModule,
        SignInModule,
        HomeModule,
        ViewPostModule,
        ViewUserModule,
        EditPostModule,
        ViewReportedPostsModule,
        SendResetPasswordModule,
        ViewAnnouncementsModule,
        SearchPostsModule,
        ViewPostsModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true
        },
        LoggedInGuard,
        IsAdminGuard
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
