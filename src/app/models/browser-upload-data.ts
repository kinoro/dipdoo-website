export class BrowserUploadData {
    storageItemId: number;
    policy: string;
    amzSignature: string;
    expirationDate: Date;
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    contentLengthMax: number;
    amzAlgorithm: string;
    amzDate: Date;
    amzServerSideEncryption: string;
    amzCredentialAccessKeyId: string;
    amzCredentialDate: Date;
    amzCredentialRegion: string;
}