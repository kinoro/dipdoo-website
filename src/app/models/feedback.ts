import { FeedbackType } from "../enums/feedback-type";
import ModelEntity from "./base/model-entity";

export class Feedback extends ModelEntity {
    feedbackType: FeedbackType;
    text: string;
}