import { ContentType } from "src/app/models/content-type";
import { Content } from "./content";

export class BasicDetails extends Content {
    title: string;
    tags: string;
    details: string;
    contentUrl: string;
    feedbackContentType: ContentType;
    publishDate: string;
    username: string;
}

export enum BasicDetailsErrorCodes {
    TitleMustBeCertainLength,
    TitleInvalidCharacters,
    DetailMustBeCertainLength,
    PublishDateInvalid,
    TooManyTags,
    InvalidTagCharacters,
    InvalidTagLength,
    ImageMissing,
    InvalidLink,
    BrokenLink
}