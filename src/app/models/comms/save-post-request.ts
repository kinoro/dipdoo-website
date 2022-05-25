import { Post } from '../post';

export class SavePostRequest {
    isNew: boolean;
    post: Post;
}