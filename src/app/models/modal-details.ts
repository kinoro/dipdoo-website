export class ModalDetails {
    inputGuid?: string;
    imageUrl?: string;
    modalType?: ModalType;
    fa?: string;
    title: string;
    text: string;
    buttons?: Array<string>;
}

export enum ModalType {
    Prompt,
    Input,
    Question,
    Loading,
    Button
}

export enum ModalResultType {
    Cancel,
    Ok
}

export class ModalResult {
    modalResultType: ModalResultType;
    inputGuid: string;
    inputText: string;
}