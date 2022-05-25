import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ModalDetails, ModalType, ModalResult, ModalResultType } from 'src/app/models/modal-details';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styles: [`
        .is-narrow {
            max-width: 400px;
        }
        .mobile-padding {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
        }
    `]
})
export class ModalComponent implements OnInit {

    modalTypeEnum: any =  ModalType;
    inputText: string;

    get isDesktop(): boolean { return this.appService.isDesktop; }
    get isActive(): boolean { return this.appService.isModalActive; }
    get fa(): string { return this.appService.modalDetails != null ? this.appService.modalDetails.fa : ""; }
    get title(): string { return this.appService.modalDetails != null ? this.appService.modalDetails.title : ""; }
    get text(): string { return this.appService.modalDetails != null ? this.appService.modalDetails.text : ""; }
    get imageUrl(): any { return this.appService.modalDetails != null 
        ? this.domSanitizer.bypassSecurityTrustUrl(this.appService.modalDetails.imageUrl)
        : ""; }
    get buttons(): Array<string> { 
        return this.appService.modalDetails.buttons; 
    }
    get hasImage(): boolean { return this.appService.modalDetails != null && this.appService.modalDetails.imageUrl != null; }
    get modalType(): ModalType { 
        return this.appService.modalDetails != null 
            ? this.appService.modalDetails.modalType != null ? this.appService.modalDetails.modalType : ModalType.Prompt
            : ModalType.Prompt;
    }
    get hasInputText(): boolean { return this.inputText != null && this.inputText.length > 0; }

    constructor(private appService: AppService, private domSanitizer: DomSanitizer) { }

    ngOnInit() {
    }

    ok() {
        var modalResult = new ModalResult();
        modalResult.modalResultType = ModalResultType.Ok;
        modalResult.inputText = this.inputText;
        modalResult.inputGuid = this.appService.modalDetails.inputGuid;
        
        this.reset();
        this.appService.hideModal(modalResult);
    }

    cancel() {
        var modalResult = new ModalResult();
        modalResult.modalResultType = ModalResultType.Cancel;

        this.reset();
        this.appService.hideModal(modalResult);
    }

    clickButton(btn: string) {
        var modalResult = new ModalResult();
        modalResult.modalResultType = ModalResultType.Ok;
        modalResult.inputGuid = btn;
        modalResult.inputText = btn;

        this.appService.hideModal(modalResult);
    }

    reset() {
        this.inputText = null;
    }
}
