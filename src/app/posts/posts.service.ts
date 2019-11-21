import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const POST_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}
    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&&page=${currentPage}`;
        this.http.get<{message: string, posts: any, maxPosts: number}>(POST_URL + queryParams)
            .pipe(map((postData) => {
                return { posts: postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath,
                        creator: post.creator
                        };
                    }),
                maxPosts: postData.maxPosts
                };
            }))
            .subscribe((transformedPostData) => {
                this.posts = transformedPostData.posts;
                this.postUpdated.next({
                            posts: [...this.posts],
                            postCount: transformedPostData.maxPosts});
            });
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    getPost(postId: string) {
        return this.http.get<{
            _id: string,
            title: string,
            content: string,
            imagePath: string,
            creator: string
        }>(
            POST_URL + postId);
    }

    addPost(title: string, content: string, image: File) {
        // const post: Post = { id: null, title, content};
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{message: string, post: Post}>(POST_URL, postData)
            .subscribe((responseData) => {
                this.router.navigate(['/']);
            });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData  = {
                id,
                title,
                content,
                imagePath: image,
                creator: null
            };
        }
        // const post: Post = { id, title, content, imagePath: null };
        this.http.put(POST_URL + id, postData)
            .subscribe((response) => {
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        return this.http.delete(POST_URL + postId);
    }
}
