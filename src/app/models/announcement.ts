import ModelEntity from './base/model-entity';

export class Announcement extends ModelEntity {
    username: string;
    postDPId: string;
    link: string;
    badge: string;
    title: string
    text: string;
    startedAt: Date;
    endedAt: Date;
}