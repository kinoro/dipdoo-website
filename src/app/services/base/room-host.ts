import { Room } from 'src/app/models/room';
import { PostSummary } from 'src/app/models/post-summary';

export class RoomHostBaseService {

    room: Room;
    posts: Array<PostSummary>;

}