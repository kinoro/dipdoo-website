import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Post } from '../models/post';
import { PostSummary } from '../models/post-summary';
import { environment } from 'src/environments/environment';
import { TestData } from './base/test-data';
import { PostListOrderBy } from '../enums/post/post-list-order-by';
import { PostListFilterBy } from '../enums/post/post-list-filter-by';

@Injectable({
  providedIn: 'root'
})
export class PostsDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async save(post: Post): Promise<Post> {
        return await this.sharedData.post<Post>(`${this.baseUrl}/private/posts`, post, this.options());
    }

    public async delete(id: string): Promise<object> {
        return await this.sharedData.delete(`${this.baseUrl}/private/posts/${id}`, this.options());
    }

    public async get(orderBy: PostListOrderBy, filterBy: PostListFilterBy, pageNumber: number, filterByValue: string): Promise<Array<Post>> {
        if (environment.useTestData) {
            return await TestData.getPosts();
        }
        return await this.sharedData.get<Array<Post>>(`${this.baseUrl}/private/posts/${orderBy}/${filterBy}/${pageNumber}/${filterByValue}`, this.options());
    }

    public async getSingle(id: string): Promise<Post> {
        if (environment.useTestData) {
            return (await TestData.getPosts()).find(x => x.id === id);
        }
        return await this.sharedData.get<Post>(`${this.baseUrl}/private/posts/single/${id}`, this.options());
    }

    public async getForUser(username: string, startFrom: number): Promise<Array<PostSummary>> {
        return await this.sharedData.get<Array<PostSummary>>(`${this.baseUrl}/private/post/u/${username}/${startFrom}`, this.options());
    }
}
