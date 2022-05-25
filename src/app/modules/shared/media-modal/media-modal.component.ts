import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ModalDetails, ModalType, ModalResult, ModalResultType } from 'src/app/models/modal-details';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaModalService } from 'src/app/services/media-modal.service';
import { ContentType } from 'src/app/models/content-type';
import { MediaType } from 'src/app/models/media-type';

@Component({
    selector: 'app-media-modal',
    templateUrl: './media-modal.component.html',
    styles: [`
        .is-narrow {
            max-width: 400px;
        }
        .mobile-padding {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
        }

        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
          }
          .video-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
    `]
})
export class MediaModalComponent implements OnInit {

    modalTypeEnum: any =  ModalType;
    inputText: string;

    get isDesktop(): boolean { return this.appService.isDesktop; }
    get isActive(): boolean { return this.mediaModalService.isModalActive; }
    get service() { return this.mediaModalService; }

    contentTypeEnum: any = ContentType;
    mediaTypeEnum: any = MediaType;

    constructor(private appService: AppService, private mediaModalService: MediaModalService) { }

    ngOnInit() {
    }

    close() {
        this.mediaModalService.hide();
    }

}
