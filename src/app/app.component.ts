import { Component, ViewChild, Renderer2, OnDestroy, OnInit, HostListener } from '@angular/core';
import { AppService } from './services/app.service';
import {Router, NavigationEnd} from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationSummary } from './models/notification-summary';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    get hasSignUpImage() { return this.appService.hasSignUpImage; }
    get isFooterVisible() { return this.appService.isFooterVisible; }
    get isBodyAlignCenter() { return this.appService.isBodyAlignCenter; }
    get isFullHeight() { return this.appService.isFullHeight; }
    get isFullWidth() { return this.appService.isFullWidth; }
    get isTopVisible() { return this.appService.isTopVisible; }
    get isSignedIn() { return this.appService.isSignedIn; }
    get isAdmin() { return this.isSignedIn && this.authService.userAccount.isAdmin; }
    get username() { return this.appService.username; }
    get siteName() { return this.appService.siteName; }
    get isDesktop() { return this.appService.isDesktop; }

    @ViewChild('dropdown') dropdown;
    @ViewChild('notificationDropdown') notificationDropdown;

    isShowMobileMenu: boolean;
    onRotateFunc: any;

    constructor(private appService: AppService,
        private authService: AuthService,
        private renderer: Renderer2,
        private router: Router) {

            // Google Analytics implementation
            // For more info: https://medium.com/@PurpleGreenLemon/how-to-properly-add-google-analytics-tracking-to-your-angular-web-app-bc7750713c9e
            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    this.isShowMobileMenu = false;
                  
                    gtag(
                        'config', 'UA-105834819-4', 
                        {
                            'page_path': event.urlAfterRedirects
                        }
                    );
                }
            });
    }

    ngOnInit() {
        this.onRotateFunc = this.renderer.listen(window, 'orientationchange', (evt) => {
            window.setTimeout(() => { this.appService.recalculateView(); }, 99); });
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.appService.refreshScreenSizeBools();
    }

    toggleMobileMenu() {
        this.isShowMobileMenu = !this.isShowMobileMenu;
    }

    goToEditPost() {
        this.renderer.removeClass(this.dropdown.nativeElement, "is-active");
        this.appService.navigateTo('/edit-post');
    }

    goToProfile() {
        this.renderer.removeClass(this.dropdown.nativeElement, "is-active");
        this.appService.navigateTo(`/u/${this.username}`);
    }

    goToReportedPosts() {
        this.renderer.removeClass(this.dropdown.nativeElement, "is-active");
        this.appService.navigateTo(`/reported-posts`);
    }

    goToUpcomingThemes() {
        this.renderer.removeClass(this.dropdown.nativeElement, "is-active");
        this.appService.navigateTo(`/upcoming-themes`);
    }

    goToAnnouncements() {
        this.renderer.removeClass(this.dropdown.nativeElement, "is-active");
        this.appService.navigateTo(`/announcements`);
    }

    logout() {
        this.appService.logout();
    } 

    ngOnDestroy() {
        if (this.onRotateFunc) {
            this.onRotateFunc();
        }
    }
}
