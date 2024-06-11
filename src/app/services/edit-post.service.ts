import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { UrlParsingService } from './url-parsing.service';
import { BasicDetails, BasicDetailsErrorCodes } from '../modules/edit-post/view-models/basic-details';
import { ContentType } from '../models/content-type';
import { FeedbackChoice, FeedbackChoiceErrorCodes } from '../modules/edit-post/view-models/feedback-choice';
import { Post, PostOption } from '../models/post';
import { MediaType } from '../models/media-type';
import { UrlMetadataDataService } from '../data/url-metadata-data.service';
import { BrowserUploadService } from './browser-upload.service';
import { Content } from '../modules/edit-post/view-models/content';
import { TagService, TagValidity } from './tag.service';

@Injectable({
    providedIn: 'root'
})
export class EditPostService {

    constructor(private appService: AppService,
        private urlMetadataData: UrlMetadataDataService,
        private urlParsingService: UrlParsingService,
        private browserUploadService: BrowserUploadService,
        private tagService: TagService) {
    }

    async validateBasicDetails(basicDetails: BasicDetails, isRevalidate: boolean = false) : Promise<boolean> {
        basicDetails.errorCodes = [];
        basicDetails.isImageTooBig = false;

        if (basicDetails.title == null || basicDetails.title.length < 5 || basicDetails.title.length > 100) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.TitleMustBeCertainLength);
        }

        if (!this.appService.isDate(basicDetails.publishDate)) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.PublishDateInvalid);
        }

        var validCharactersRegex = /^[a-zA-Z0-9,\-+?!.,'():$£% ]+$/i;
        if (!validCharactersRegex.test(basicDetails.title)) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.TitleInvalidCharacters);
        }

        var tagValidity = this.tagService.getTagsValidity(basicDetails.tags);
        if (tagValidity == TagValidity.InvalidCharacterLength) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.InvalidTagLength);
        } else if (tagValidity == TagValidity.InvalidDodgyCharacters) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.InvalidTagCharacters);
        } else if (tagValidity == TagValidity.InvalidTooManyTags) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.TooManyTags);
        }
        basicDetails.tags = this.tagService.convertTagListToTags(this.tagService.convertTagsToTagList(basicDetails.tags));

        if (basicDetails.details != null && basicDetails.details.length > 5000) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.DetailMustBeCertainLength);
        }

        if (basicDetails.contentType == ContentType.Image && basicDetails.image == null) {
            basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.ImageMissing);
        }

        if (basicDetails.contentType == ContentType.Link) {
            var santizedUrl = this.urlParsingService.sanitizeUrl(basicDetails.contentUrl);
            let isLinkValid = this.urlParsingService.isLinkValid(santizedUrl);
            if (!isLinkValid) {
                basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.InvalidLink);
            }
            else if (!isRevalidate) {
                let isLinkUnbroken = await this.urlParsingService.isLinkUnbroken(santizedUrl);
                if (!isLinkUnbroken) {
                    basicDetails.errorCodes.push(<number>BasicDetailsErrorCodes.BrokenLink);
                }
            }
        }

        basicDetails.hasSubmitted = true;
        return !basicDetails.hasErrors; 
    }

    async validateFeedbackChoice(feedbackChoice: FeedbackChoice, isRevalidate: boolean = false): Promise<boolean> {
        feedbackChoice.errorCodes = [];
        feedbackChoice.isImageTooBig = false;

        if ((feedbackChoice.contentType == ContentType.TextOnly || feedbackChoice.contentType == ContentType.Link) &&
            (feedbackChoice.text == null || feedbackChoice.text.length < 1 || feedbackChoice.text.length > 30)) {
                feedbackChoice.errorCodes.push(<number>FeedbackChoiceErrorCodes.TextMustBeCertainLength);
        }

        var validCharactersRegex = /^[a-zA-Z0-9,\-+?!.,'():$£% ]+$/i;
        if (!validCharactersRegex.test(feedbackChoice.text)) {
            feedbackChoice.errorCodes.push(<number>FeedbackChoiceErrorCodes.TextInvalidCharacters);
        }

        if (feedbackChoice.contentType == ContentType.Image && feedbackChoice.image == null) {
            feedbackChoice.errorCodes.push(<number>FeedbackChoiceErrorCodes.ImageMissing);
        }

        if (feedbackChoice.contentType == ContentType.Link) {
            var santizedUrl = this.urlParsingService.sanitizeUrl(feedbackChoice.contentUrl);
            let isLinkValid = this.urlParsingService.isLinkValid(santizedUrl);
            if (!isLinkValid) {
                feedbackChoice.errorCodes.push(<number>FeedbackChoiceErrorCodes.InvalidLink);
            }
            else if (!isRevalidate) {
                let isLinkUnbroken = await this.urlParsingService.isLinkUnbroken(santizedUrl);
                if (!isLinkUnbroken) {
                    feedbackChoice.errorCodes.push(<number>FeedbackChoiceErrorCodes.BrokenLink);
                }
            }
        }

        feedbackChoice.hasSubmitted = true;
        return !feedbackChoice.hasErrors; 
    }

    async convertToPost(basicDetails: BasicDetails, feedbackChoices: FeedbackChoice[]): Promise<Post> {

        const BROKEN_LINK_IMAGE_URL = `${window.location.protocol}//${window.location.host}/assets/icon-blue-faded-512.png`;

        const post = new Post();
        post.title = basicDetails.title;
        post.tags = basicDetails.tags == null ? [] : basicDetails.tags.split(',');
        post.details = basicDetails.details;
        post.publishDate = new Date(basicDetails.publishDate);
        post.contentType = basicDetails.contentType;
        post.username = basicDetails.username;

        if (post.contentType == ContentType.Image) {
            await this.uploadImage(basicDetails);
            post.imageUrl = this.urlParsingService.sanitizeUrl(basicDetails.imageHostedUrl);
        } else if (post.contentType == ContentType.Link) {
            post.linkUrl = this.urlParsingService.sanitizeUrl(basicDetails.contentUrl);
            var mediaType = this.urlParsingService.getMediaType(basicDetails.contentUrl);
            if (mediaType == MediaType.YouTube) {
                post.imageUrl = this.urlParsingService.getMediaPreviewUrl(basicDetails.contentUrl);
            } else {
                var urlMetadata = await this.urlMetadataData.generate(basicDetails.contentUrl);
                post.imageUrl = (urlMetadata.imageUrl || "").length > 0 ? urlMetadata.imageUrl : BROKEN_LINK_IMAGE_URL;
            }
        }

        post.options = [];

        var optionPromises = [];
        for (let x of feedbackChoices) {
            optionPromises.push(new Promise<void>(async (resolve, reject) => {
                try {
                    var postOption = new PostOption();
                    postOption.contentType = x.contentType;
                    postOption.id = feedbackChoices.indexOf(x);
                    postOption.text = x.text;
        
                    if (x.contentType == ContentType.Image) {
                        await this.uploadImage(x);
                        postOption.imageUrl = this.urlParsingService.sanitizeUrl(x.imageHostedUrl);
                    } else if (x.contentType == ContentType.Link) {
                        postOption.linkUrl = this.urlParsingService.sanitizeUrl(x.contentUrl);
                        postOption.imageUrl = x.otherUrl;
                        var mediaType = this.urlParsingService.getMediaType(x.contentUrl);
                        if (mediaType == MediaType.YouTube) {
                            postOption.imageUrl = this.urlParsingService.getMediaPreviewUrl(x.contentUrl);
                        } else {
                            var urlMetadata = await this.urlMetadataData.generate(x.contentUrl);
                            postOption.imageUrl = (urlMetadata.imageUrl || "").length > 0 ? urlMetadata.imageUrl : BROKEN_LINK_IMAGE_URL;
                        }
                    }
        
                    post.options.push(postOption);

                    resolve();
                } catch (err) {
                    reject(err);
                }
            }));
        }
        await Promise.all(optionPromises);

        return post;
    }

    async uploadImage(content: Content) {
        if (content.imageHostedUrl == null || content.imageHostedUrl.length == 0) {
            // call create storage item to get browser upload data
            const filename = `${this.appService.newGuid()}.${content.imageExt}`;
            const browserUploadData = await this.browserUploadService.getUploadData(filename);

            // build form data from browser upload data
            const formData = this.browserUploadService.buildFormData(browserUploadData, filename, content.image);

            // send to aws
            await this.browserUploadService.postToS3(formData);
            content.imageHostedUrl = await this.browserUploadService.confirmStorageItem(browserUploadData.storageItemId);
        }
    }
}