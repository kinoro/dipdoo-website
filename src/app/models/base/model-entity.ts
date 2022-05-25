// import { Serializable, SerializableDate } from './serializable';

export default abstract class ModelEntity // extends Serializable
{
    id: string;
    createdAt?: Date = new Date();
    updatedAt?: Date = new Date();
}
