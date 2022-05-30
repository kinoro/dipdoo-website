import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { IdDesc } from '../models/id-desc';
import { ModalDetails, ModalResult, ModalResultType } from '../models/modal-details';
import { Subject, Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserAccount } from '../models/user-account';
import { SeoSocialShareService } from './seo-social-share.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    siteName: string = "Dipdoo";
    tagTitle: string = "Dipdoo";
    tagDescription: string = "Multi choice for the masses";
    tagImage: string = this.resolveAsset("icon-logo-1024.png");
    tagUrl: string = "https://www.dipdoo.net";
    tagTwitterCard: string = "summary_large_image";
    isTopVisible: boolean = true;
    isFullHeight: boolean;
    isFullWidth: boolean = false;
    isFooterVisible: boolean = true;
    isBodyAlignCenter: boolean = false;
    hasSignUpImage: boolean = false;
    modalDetails: ModalDetails;
    isViewPortrait: boolean = false;
    isDesktop: boolean = false;

    get isSignedIn() { return this.authService.isSignedIn; }
    get isModalActive() { return this.modalDetails != null; }
    get username() { return this.authService.userAccount.username; }
    get isEmailConfirmed() { return this.authService.userAccount.isEmailConfirmed; }
    get hasLoadedUser() { return this.authService.hasAttemptedRestore; }

    private modalResultEvents: Subject<ModalResult>;
    private lastModalResult: ModalResult;

    constructor(private meta: Meta,
        private router: Router,
        private authService: AuthService,
        private deviceDetectorService: DeviceDetectorService,
        private seoService: SeoSocialShareService ) {

        this.modalResultEvents = new Subject<ModalResult>();
        this.isDesktop = this.deviceDetectorService.isDesktop();
        this.recalculateView();
    }

    updateSeo() {
        this.seoService.viewAny();
    }

    recalculateView() {
        this.isViewPortrait = window.innerHeight > window.innerWidth;
    }

    addTag(name: string, content: string) {
        this.meta.addTag({ name: name, content: content });
    }

    resolveAsset(filePath: string): string {
        return `${window.location.protocol}//${window.location.host}/assets/${filePath}`;
    }

    tryRestoreUser() {
        this.authService.tryRestoreUser();
    }

    logout() {
        this.authService.logout();
        this.navigateTo("/home");
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    newGuid() {
        var _p8 = (s = null) => {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    getEnumIdDescList(enumType: any, notSetText: string = "Please choose..."): Array<IdDesc> {
        var idDescList = [];

        for (var enumValue in enumType) {
            var enumValueNumber = parseInt(enumValue, 10);
            if (enumValueNumber >= 0) {
                var desc = enumType[enumValue];
                if (desc == "NotSet") {
                    desc = notSetText;
                }
                var formattedDesc = desc.replace(/([A-Z])/g, ' $1').replace('And', 'and').trim();
                idDescList.push({ id: enumValueNumber, description: formattedDesc });
            }
        }

        return idDescList;
    }

    timeSince(date: Date) {
        const YEAR_SECONDS = 31536000;
        const MONTH_SECONDS = 2592000;
        const DAY_SECONDS = 86400;
        const HOUR_SECONDS = 3600;
        const MINUTE_SECONDS = 60;

        var now = new Date();
        var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        var interval = Math.floor(seconds / 31536000);
        var amount = Math.floor(seconds);
        var unit = "second";

        if (Math.floor(seconds / YEAR_SECONDS) >= 1) {
            amount = Math.floor(seconds / YEAR_SECONDS);
            unit = "year";
        }
        else if (Math.floor(seconds / MONTH_SECONDS) >= 1) {
            amount = Math.floor(seconds / MONTH_SECONDS);
            unit = "month";
        }
        else if (Math.floor(seconds / DAY_SECONDS) >= 1) {
            amount = Math.floor(seconds / DAY_SECONDS);
            unit = "day";
        }
        else if (Math.floor(seconds / HOUR_SECONDS) >= 1) {
            amount = Math.floor(seconds / HOUR_SECONDS);
            unit = "hour";
        }
        else if (Math.floor(seconds / MINUTE_SECONDS) >= 1) {
            amount = Math.floor(seconds / MINUTE_SECONDS);
            unit = "minute";
        }
        else {
            amount = seconds;
            unit = "second";
        }

        var multipleText = amount == 1 ? "" : "s";
        return `${amount} ${unit}${multipleText} ago`;
    }

    dateString(date: Date) {
        var dateString = '';
        var day = date.getDate();
        if (day === 1 || day === 21 || day === 31) {
            dateString = `${day}st`;
        } else if (day === 2 || day === 22) {
            dateString = `${day}nd`;
        } else if (day === 3 || day === 23) {
            dateString = `${day}rd`;
        } else {
            dateString = `${day}th`
        }

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        dateString += ` ${months[date.getMonth()]} ${date.getFullYear()}`;

        return dateString;
    }

    listenForModalResult(): Observable<ModalResult> {
        return this.modalResultEvents.asObservable();
    }

    showModal(modalDetails: ModalDetails) {
        this.modalDetails = modalDetails;
    }

    showModalAsync(modalDetails: ModalDetails): Promise<ModalResult> {
        const maxTimeout = 60000;
        const incrementTimeout = 200;
        let currentTimeout = 0;


        return new Promise<ModalResult>(res => {
            this.lastModalResult = null;
            this.showModal(modalDetails);

            var checkForResult = () => {
                currentTimeout += incrementTimeout;
                if (currentTimeout > maxTimeout) {
                    const cancelModalResult = new ModalResult();
                    cancelModalResult.modalResultType = ModalResultType.Cancel;
                    res(cancelModalResult);
                }

                if (this.lastModalResult == null) {
                    setTimeout(checkForResult, incrementTimeout);
                    return;
                }

                res(this.lastModalResult);
            }

            checkForResult();
        });
    }

    hideModal(modalResult: ModalResult) {
        this.modalDetails = null;

        if (modalResult == null) {
            modalResult = new ModalResult();
            modalResult.modalResultType = ModalResultType.Cancel;
            modalResult.inputGuid = this.newGuid();
            modalResult.inputText = '';
        }

        this.lastModalResult = modalResult;
        this.modalResultEvents.next(modalResult);
    }

    convertRemToPixels(rem) {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    linkify(stringToEdit: string) {

        // http://, https://, ftp://
        const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return stringToEdit
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
    };

    getUserImageUrl(userAccount: UserAccount) {
        return `assets/user-icon-512.png`;
    }

    arrayMove(arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing purposes
    };

    openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }

    isDate(_date){
        const _regExp  = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$');
        return _regExp.test(_date);
    }
}
