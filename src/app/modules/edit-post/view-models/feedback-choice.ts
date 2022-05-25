import { ContentType } from "src/app/models/content-type";
import { PostOption } from "src/app/models/post";
import { Content } from "./content";

export class FeedbackChoice extends Content {
    text: string;
    contentUrl: string;
    otherUrl: string;
}

export enum FeedbackChoiceErrorCodes {
    TextMustBeCertainLength,
    TextInvalidCharacters,
    ImageMissing,
    InvalidLink,
    BrokenLink
}