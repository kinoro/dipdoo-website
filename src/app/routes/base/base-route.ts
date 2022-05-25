import { AppService } from 'src/app/services/app.service';

export abstract class BaseRoute {
    
    private static readonly META_TAG_TITLE = "og:title";
    private static readonly META_TAG_DESCRIPTION = "og:description";
    private static readonly META_TAG_IMAGE = "og:image";
    private static readonly META_TAG_URL = "og:url";
    private static readonly META_TAG_TWITTER_CARD = "twitter:card";

    get siteName() { return this.appService.siteName; }
    get tagTitle() { return this.appService.tagTitle; }
    get tagDescription()  { return this.appService.tagDescription; }
    get tagImage()  { return this.appService.tagImage; }
    get tagUrl()  { return this.appService.tagUrl; }
    get tagTwitterCard()  { return this.appService.tagTwitterCard; }
    get isTopVisible() { return this.appService.isTopVisible; }
    get isSignedIn() { return this.appService.isSignedIn; }
    get username() { return this.appService.username; }

    constructor(public appService: AppService) {
        this.setViewOptions();
        this.setSeoMetaData();
        this.addTags();
        this.appService.tryRestoreUser();
    }

    protected setViewOptions() {
        this.appService.isTopVisible = true;
        this.appService.isFullHeight = true;
        this.appService.isFullWidth = false;
        this.appService.isBodyAlignCenter = false;
        this.appService.hasSignUpImage = false;
        this.appService.isFooterVisible = true;
    }

    protected setSeoMetaData() {
        this.appService.updateSeo();
    }

    protected addTags() {
        this.appService.addTag(BaseRoute.META_TAG_TITLE, this.tagTitle);
        this.appService.addTag(BaseRoute.META_TAG_DESCRIPTION, this.tagDescription);
        this.appService.addTag(BaseRoute.META_TAG_IMAGE, this.tagImage);
        this.appService.addTag(BaseRoute.META_TAG_URL, this.tagUrl);
        this.appService.addTag(BaseRoute.META_TAG_TWITTER_CARD, this.tagTwitterCard);
    }
}